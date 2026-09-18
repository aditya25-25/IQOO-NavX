import { Coordinates, GPSQuality, PositionState, SensorData } from '../types';
import { getDistanceMeters } from '../engine/offlineRouter';

export class PositionFusionManager {
  private currentPosition: Coordinates;
  private heading: number = 0;
  private speed: number = 0; // meters per second
  private accuracyMeters: number = 4.0;
  private gpsQuality: GPSQuality = 'strong';
  private isSensorAssisted: boolean = false;
  private isRecoverySmoothing: boolean = false;

  // Dead reckoning accumulator
  private recoveryTargetGps: Coordinates | null = null;
  private recoveryStepCount: number = 0;

  // IMU sensor cache
  private sensorData: SensorData = {
    accelerometer: { x: 0, y: 0, z: 9.81 },
    gyroscope: { alpha: 0, beta: 0, gamma: 0 },
    compassHeading: 0,
    stepCount: 0,
    isAvailable: true,
  };

  private listeners: Array<(state: PositionState) => void> = [];

  constructor(initialCoord: Coordinates) {
    this.currentPosition = { ...initialCoord };
    this.initSensors();
  }

  private initSensors() {
    if (typeof window !== 'undefined') {
      // Device Orientation for compass
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
          if (e.alpha !== null) {
            this.sensorData.gyroscope.alpha = e.alpha;
            this.sensorData.gyroscope.beta = e.beta || 0;
            this.sensorData.gyroscope.gamma = e.gamma || 0;
            this.sensorData.compassHeading = e.alpha;
            if (this.gpsQuality === 'weak' || this.gpsQuality === 'lost') {
              this.heading = e.alpha;
            }
          }
        });
      }

      // Device Motion for accelerometer
      if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
          if (e.acceleration) {
            this.sensorData.accelerometer = {
              x: e.acceleration.x || 0,
              y: e.acceleration.y || 0,
              z: e.acceleration.z || 9.81,
            };
          }
        });
      }
    }
  }

  public subscribe(cb: (state: PositionState) => void): () => void {
    this.listeners.push(cb);
    cb(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const state = this.getState();
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  public getState(): PositionState {
    return {
      currentPosition: { ...this.currentPosition },
      heading: this.heading,
      speed: this.speed,
      accuracyMeters: this.accuracyMeters,
      source: this.isSensorAssisted ? 'sensor_fusion' : 'gps',
      gpsQuality: this.gpsQuality,
      isSensorAssisted: this.isSensorAssisted,
      isRecoverySmoothing: this.isRecoverySmoothing,
      lastUpdated: Date.now(),
    };
  }

  // Update real or simulated GPS reading
  public updateGpsPosition(newGpsCoord: Coordinates, speedMs: number, headingDeg?: number, accuracy = 4.0) {
    if (this.gpsQuality === 'strong') {
      // Normal reliable GPS
      this.isSensorAssisted = false;
      this.isRecoverySmoothing = false;
      this.accuracyMeters = accuracy;
      this.currentPosition = { ...newGpsCoord };
      this.speed = speedMs;
      if (headingDeg !== undefined) {
        this.heading = headingDeg;
      }
      this.notify();
      return;
    }

    if (this.gpsQuality === 'weak' || this.gpsQuality === 'lost') {
      // GPS is weak - ignore or down-weight noisy GPS jump, rely on Sensor Dead Reckoning
      this.isSensorAssisted = true;
      this.accuracyMeters = 24.0 + Math.random() * 8; // degraded uncertainty radius
      // Perform dead-reckoning advance
      this.stepDeadReckoning(speedMs, headingDeg);
      return;
    }
  }

  // Set GPS Quality (for simulation / real underground tunnel detection)
  public setGpsQuality(quality: GPSQuality, trueGpsCoord?: Coordinates) {
    const prevQuality = this.gpsQuality;
    this.gpsQuality = quality;

    if (quality === 'weak' || quality === 'lost') {
      this.isSensorAssisted = true;
      this.accuracyMeters = 28.0;
    } else if (quality === 'strong') {
      if (prevQuality === 'weak' || prevQuality === 'lost') {
        // Recovery phase! Smoothly correct the estimated position to the true GPS coordinate
        if (trueGpsCoord) {
          this.beginGpsRecovery(trueGpsCoord);
        } else {
          this.isSensorAssisted = false;
          this.isRecoverySmoothing = false;
          this.accuracyMeters = 4.0;
        }
      } else {
        this.isSensorAssisted = false;
        this.isRecoverySmoothing = false;
        this.accuracyMeters = 4.0;
      }
    }
    this.notify();
  }

  // Advance position via IMU Sensor Dead Reckoning
  public stepDeadReckoning(speedMs: number, headingDeg?: number, dtSeconds = 1.0) {
    if (headingDeg !== undefined) {
      this.heading = headingDeg;
    } else if (this.sensorData.compassHeading) {
      this.heading = this.sensorData.compassHeading;
    }
    this.speed = speedMs;

    // Convert speed & heading to lat/lng displacement
    const distanceMeters = speedMs * dtSeconds;
    const headingRad = (this.heading * Math.PI) / 180;

    // 1 deg lat ~= 111,111 meters
    const deltaLat = (distanceMeters * Math.cos(headingRad)) / 111111;
    // 1 deg lng ~= 111,111 * cos(lat) meters
    const deltaLng =
      (distanceMeters * Math.sin(headingRad)) /
      (111111 * Math.cos((this.currentPosition.lat * Math.PI) / 180));

    // Accumulate position with slight sensor drift
    this.currentPosition = {
      lat: this.currentPosition.lat + deltaLat,
      lng: this.currentPosition.lng + deltaLng,
    };

    this.notify();
  }

  // Smooth position recovery over successive frames
  private beginGpsRecovery(targetGps: Coordinates) {
    this.isRecoverySmoothing = true;
    this.isSensorAssisted = false;
    this.recoveryTargetGps = targetGps;
    this.recoveryStepCount = 0;

    const recoveryInterval = setInterval(() => {
      this.recoveryStepCount++;
      const alpha = 0.35; // Exponential moving average blend factor

      this.currentPosition = {
        lat: this.currentPosition.lat + alpha * (this.recoveryTargetGps!.lat - this.currentPosition.lat),
        lng: this.currentPosition.lng + alpha * (this.recoveryTargetGps!.lng - this.currentPosition.lng),
      };

      const distRemaining = getDistanceMeters(this.currentPosition, this.recoveryTargetGps!);
      if (distRemaining < 1.0 || this.recoveryStepCount > 10) {
        this.currentPosition = { ...this.recoveryTargetGps! };
        this.isRecoverySmoothing = false;
        this.recoveryTargetGps = null;
        this.accuracyMeters = 3.5;
        clearInterval(recoveryInterval);
      }
      this.notify();
    }, 120);
  }

  // Force map-snapping to nearest road segment
  public snapToRoadCoordinate(target: Coordinates) {
    this.currentPosition = { ...target };
    this.notify();
  }
}
