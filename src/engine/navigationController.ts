import {
  Coordinates,
  MapRegion,
  NavigationStatus,
  Route,
  TurnInstruction,
} from '../types';
import {
  calculateOfflineRoute,
  getBearing,
  getDistanceMeters,
  isOffRoute,
} from './offlineRouter';
import { PositionFusionManager } from '../sensors/positionFusion';
import { voiceEngine } from '../voice/voiceGuidance';

export interface NavigationProgress {
  status: NavigationStatus;
  activeRoute: Route | null;
  currentStepIndex: number;
  currentInstruction: TurnInstruction | null;
  distanceToNextTurnMeters: number;
  remainingDistanceMeters: number;
  remainingDurationSeconds: number;
  progressPercent: number;
  isOffRouteDetected: boolean;
  rerouteCount: number;
}

export class NavigationController {
  private status: NavigationStatus = 'idle';
  private activeRoute: Route | null = null;
  private currentStepIndex: number = 0;
  private distanceToNextTurnMeters: number = 0;
  private remainingDistanceMeters: number = 0;
  private remainingDurationSeconds: number = 0;
  private isOffRouteDetected: boolean = false;
  private rerouteCount: number = 0;

  private activeRegion: MapRegion;
  private positionManager: PositionFusionManager;

  // Simulation tick timer
  private simIntervalId: any = null;
  private currentCoordIndex: number = 0;
  private simSpeedMultiplier: number = 1.0;

  private listeners: Array<(progress: NavigationProgress) => void> = [];

  constructor(
    region: MapRegion,
    positionManager: PositionFusionManager
  ) {
    this.activeRegion = region;
    this.positionManager = positionManager;
  }

  public setRegion(region: MapRegion) {
    this.activeRegion = region;
  }

  public subscribe(
    cb: (progress: NavigationProgress) => void
  ): () => void {
    this.listeners.push(cb);
    cb(this.getProgress());

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== cb
      );
    };
  }

  private notify() {
    const progress = this.getProgress();

    for (const listener of this.listeners) {
      listener(progress);
    }
  }

  public getProgress(): NavigationProgress {
    const currentInstruction =
      this.activeRoute &&
      this.activeRoute.instructions[this.currentStepIndex]
        ? this.activeRoute.instructions[this.currentStepIndex]
        : null;

    const totalDist =
      this.activeRoute?.totalDistanceMeters || 1;

    const progressPercent = Math.min(
      100,
      Math.max(
        0,
        ((totalDist - this.remainingDistanceMeters) /
          totalDist) *
          100
      )
    );

    return {
      status: this.status,
      activeRoute: this.activeRoute,
      currentStepIndex: this.currentStepIndex,
      currentInstruction,
      distanceToNextTurnMeters: Math.round(
        this.distanceToNextTurnMeters
      ),
      remainingDistanceMeters: Math.round(
        this.remainingDistanceMeters
      ),
      remainingDurationSeconds: Math.round(
        this.remainingDurationSeconds
      ),
      progressPercent: Math.round(progressPercent),
      isOffRouteDetected: this.isOffRouteDetected,
      rerouteCount: this.rerouteCount,
    };
  }

  public startPreview(route: Route) {
    this.stopSimulation();

    this.activeRoute = route;
    this.status = 'previewing';
    this.currentStepIndex = 0;
    this.currentCoordIndex = 0;

    this.remainingDistanceMeters =
      route.totalDistanceMeters;

    this.remainingDurationSeconds =
      route.totalDurationSeconds;

    this.distanceToNextTurnMeters =
      route.instructions[0]?.distanceMeters || 0;

    this.isOffRouteDetected = false;

    // New route = new navigation session
    this.rerouteCount = 0;

    this.notify();
  }

  public startNavigation(route?: Route) {
    if (route) {
      this.activeRoute = route;
    }

    if (!this.activeRoute) return;

    this.status = 'navigating';
    this.currentStepIndex = 0;
    this.currentCoordIndex = 0;

    this.remainingDistanceMeters =
      this.activeRoute.totalDistanceMeters;

    this.remainingDurationSeconds =
      this.activeRoute.totalDurationSeconds;

    this.distanceToNextTurnMeters =
      this.activeRoute.instructions[0]?.distanceMeters || 0;

    this.isOffRouteDetected = false;

    // New navigation session starts with zero reroutes.
    // Reroutes that happen during this trip will increment normally.
    this.rerouteCount = 0;

    // Speak initial route prompt
    const firstTurn =
      this.activeRoute.instructions[0];

    voiceEngine.speak(
      `Starting navigation to ${this.activeRoute.destinationName}. ${
        firstTurn?.instruction || 'Proceed on route'
      }.`,
      true
    );

    this.startSimulationLoop();
    this.notify();
  }

  public stopNavigation() {
    this.stopSimulation();

    this.status = 'idle';
    this.activeRoute = null;
    this.isOffRouteDetected = false;

    this.currentStepIndex = 0;
    this.currentCoordIndex = 0;
    this.distanceToNextTurnMeters = 0;
    this.remainingDistanceMeters = 0;
    this.remainingDurationSeconds = 0;

    voiceEngine.speak(
      'Navigation stopped.',
      true
    );

    this.notify();
  }

  public pauseNavigation() {
    this.stopSimulation();
    this.status = 'paused';
    this.notify();
  }

  public resumeNavigation() {
    if (
      this.status === 'paused' &&
      this.activeRoute
    ) {
      this.status = 'navigating';
      this.startSimulationLoop();
      this.notify();
    }
  }

  public setSimSpeed(speedMultiplier: number) {
    // Prevent invalid simulation intervals.
    this.simSpeedMultiplier = Math.max(
      0.1,
      speedMultiplier
    );

    // If navigation is already running, restart the loop
    // so the new speed takes effect immediately.
    if (this.status === 'navigating') {
      this.startSimulationLoop();
    }
  }

  // Simulate vehicle advancing along route coordinates
  private startSimulationLoop() {
    this.stopSimulation();

    this.simIntervalId = setInterval(() => {
      if (
        this.status !== 'navigating' ||
        !this.activeRoute
      ) {
        return;
      }

      const coords =
        this.activeRoute.coordinates;

      if (
        this.currentCoordIndex >=
        coords.length - 1
      ) {
        // Destination arrived!
        const destinationName =
          this.activeRoute.destinationName;

        this.status = 'arrived';
        this.stopSimulation();

        // Arrival state should show zero remaining metrics.
        this.remainingDistanceMeters = 0;
        this.remainingDurationSeconds = 0;
        this.distanceToNextTurnMeters = 0;
        this.isOffRouteDetected = false;

        voiceEngine.speak(
          `You have arrived at your destination: ${destinationName}.`,
          true
        );

        this.notify();
        return;
      }

      // Progress to next sub-coordinate
      this.currentCoordIndex++;

      const currentCoord =
        coords[this.currentCoordIndex];

      const prevCoord =
        coords[this.currentCoordIndex - 1];

      const bearing = getBearing(
        prevCoord,
        currentCoord
      );

      const speedMs =
        15 * this.simSpeedMultiplier;

      // Update position fusion engine
      this.positionManager.updateGpsPosition(
        currentCoord,
        speedMs,
        bearing
      );

      // Recalculate remaining distance and next turn
      this.updateRemainingMeters(
        currentCoord
      );

      // Check if off-route
      if (
        isOffRoute(
          currentCoord,
          coords,
          80
        )
      ) {
        this.triggerOfflineReroute(
          currentCoord
        );
        return;
      }

      this.notify();
    }, 1000 / this.simSpeedMultiplier);
  }

  private stopSimulation() {
    if (this.simIntervalId) {
      clearInterval(this.simIntervalId);
      this.simIntervalId = null;
    }
  }

  private updateRemainingMeters(
    currentPos: Coordinates
  ) {
    if (!this.activeRoute) return;

    let remainingDist = 0;

    const coords =
      this.activeRoute.coordinates;

    for (
      let i = this.currentCoordIndex;
      i < coords.length - 1;
      i++
    ) {
      remainingDist += getDistanceMeters(
        coords[i],
        coords[i + 1]
      );
    }

    this.remainingDistanceMeters =
      remainingDist;

    this.remainingDurationSeconds =
      Math.round(remainingDist / 12);

    // Find next turn instruction ahead
    for (
      let s = this.currentStepIndex;
      s < this.activeRoute.instructions.length;
      s++
    ) {
      const step =
        this.activeRoute.instructions[s];

      const distToStep =
        getDistanceMeters(
          currentPos,
          step.coordinate
        );

      if (
        distToStep < 25 &&
        s <
          this.activeRoute.instructions.length - 1
      ) {
        // Step reached, advance to next step
        this.currentStepIndex = s + 1;

        const nextStep =
          this.activeRoute.instructions[
            this.currentStepIndex
          ];

        if (nextStep) {
          voiceEngine.speak(
            nextStep.instruction
          );
        }
      }
    }

    const currentStep =
      this.activeRoute.instructions[
        this.currentStepIndex
      ];

    if (currentStep) {
      this.distanceToNextTurnMeters =
        getDistanceMeters(
          currentPos,
          currentStep.coordinate
        );
    }
  }

  // Force trigger a simulated missed turn
  // Used by the hackathon demo.
  public simulateMissedTurn() {
    if (
      !this.activeRoute ||
      this.status !== 'navigating'
    ) {
      return;
    }

    // Force vehicle to a demo detour point.
    const missedCoord: Coordinates = {
      lat: 12.9380,
      lng: 77.7250,
    };

    this.positionManager.updateGpsPosition(
      missedCoord,
      12,
      110
    );

    this.triggerOfflineReroute(
      missedCoord
    );
  }

  // Automatic offline rerouting calculation
  public triggerOfflineReroute(
    fromCoord: Coordinates
  ) {
    if (
      !this.activeRoute ||
      this.status === 'rerouting'
    ) {
      return;
    }

    // Capture the destination before the async
    // rerouting operation begins.
    const destination =
      this.activeRoute.destination;

    const destinationName =
      this.activeRoute.destinationName;

    this.status = 'rerouting';
    this.isOffRouteDetected = true;
    this.rerouteCount++;

    this.notify();

    voiceEngine.speak(
      'Off-route detected. Recalculating offline route...',
      true
    );

    // Compute alternative offline route
    // without internet.
    setTimeout(() => {
      // Navigation may have been stopped while
      // the reroute was being calculated.
      if (!this.activeRoute) {
        return;
      }

      const newRoute =
        calculateOfflineRoute(
          fromCoord,
          'Current Position (Off-Route Detour)',
          destination,
          destinationName,
          this.activeRegion
        );

      if (newRoute) {
        this.activeRoute = newRoute;
        this.status = 'navigating';
        this.currentStepIndex = 0;
        this.currentCoordIndex = 0;

        this.remainingDistanceMeters =
          newRoute.totalDistanceMeters;

        this.remainingDurationSeconds =
          newRoute.totalDurationSeconds;

        this.distanceToNextTurnMeters =
          newRoute.instructions[0]
            ?.distanceMeters || 0;

        this.isOffRouteDetected = false;

        voiceEngine.speak(
          `Route recalculated. In ${
            newRoute.instructions[0]
              ?.distanceMeters || 100
          } meters, ${
            newRoute.instructions[0]
              ?.instruction || 'continue'
          }.`,
          true
        );

        this.startSimulationLoop();
        this.notify();
      } else {
        // Reroute failed, but keep navigation alive.
        this.status = 'navigating';
        this.isOffRouteDetected = false;
        this.notify();
      }
    }, 750);
  }
}
