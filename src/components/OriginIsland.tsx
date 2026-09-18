import React, { useState } from 'react';
import { 
  Navigation, 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  Compass, 
  WifiOff, 
  Cpu, 
  BatteryCharging, 
  Battery, 
  ChevronDown, 
  ChevronUp,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { ManeuverType, PositionState, BatteryState } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface OriginIslandProps {
  navProgress: NavigationProgress;
  posState: PositionState;
  batteryState: BatteryState;
  isOffline: boolean;
  onToggleExpand?: () => void;
  onToggleUltraMode?: () => void;
}

export const OriginIsland: React.FC<OriginIslandProps> = ({
  navProgress,
  posState,
  batteryState,
  isOffline,
  onToggleUltraMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getManeuverIcon = (type: ManeuverType, size = 18) => {
    switch (type) {
      case 'turn-left':
      case 'sharp-left':
        return <CornerUpLeft size={size} className="text-[#ff4800]" />;
      case 'turn-right':
      case 'sharp-right':
        return <CornerUpRight size={size} className="text-[#ff4800]" />;
      case 'slight-left':
        return <CornerUpLeft size={size} className="text-[#ff4800] -rotate-12" />;
      case 'slight-right':
        return <CornerUpRight size={size} className="text-[#ff4800] rotate-12" />;
      case 'arrive':
        return <Navigation size={size} className="text-[#00e676]" />;
      case 'depart':
      case 'straight':
      default:
        return <ArrowUp size={size} className="text-[#ff4800]" />;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.ceil(seconds / 60);
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins} min`;
  };

  const maneuver = navProgress.currentInstruction?.maneuver || 'straight';
  const instruction = navProgress.currentInstruction?.instruction || 'Proceed on current route';
  const distanceToTurn = navProgress.distanceToNextTurnMeters;

  return (
    <div className="relative z-50 flex flex-col items-center w-full px-4 pt-2 select-none">
      {/* Origin Island Floating Container */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer transition-all duration-300 ease-out backdrop-blur-xl ${
          batteryState.isUltraMode
            ? 'bg-black border border-white/20 text-white rounded-2xl shadow-none'
            : 'bg-[#10141e]/90 border border-white/10 hover:border-[#ff4800]/50 text-white rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.65)]'
        } ${isExpanded ? 'w-full max-w-md p-4' : 'w-auto px-4 py-2.5 flex items-center gap-3'}`}
      >
        {/* COLLAPSED PILL VIEW */}
        {!isExpanded ? (
          <div className="flex items-center gap-3.5">
            {/* Origin Island Glow Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff4800] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-400 font-display">
                Origin Island
              </span>
            </div>

            <div className="h-3.5 w-px bg-white/15" />

            {/* Maneuver mini preview */}
            {navProgress.status === 'navigating' || navProgress.status === 'rerouting' ? (
              <div className="flex items-center gap-2 font-display">
                <div className="p-1 rounded-full bg-[#ff4800]/15">
                  {getManeuverIcon(maneuver, 15)}
                </div>
                <span className="text-xs font-semibold text-white tracking-wide">
                  {formatDistance(distanceToTurn)}
                </span>
                <span className="text-[11px] text-neutral-400 truncate max-w-[120px]">
                  {navProgress.currentInstruction?.roadName || 'Next road'}
                </span>
              </div>
            ) : (
              <span className="text-xs text-neutral-300 font-medium">
                IQOO NavX Active
              </span>
            )}

            <div className="h-3.5 w-px bg-white/15" />

            {/* Dynamic Status Badges */}
            <div className="flex items-center gap-1.5">
              {isOffline && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                  <WifiOff size={10} />
                  <span>OFFLINE</span>
                </div>
              )}

              {posState.isSensorAssisted && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-cyan-400">
                  <Cpu size={10} />
                  <span>SENSOR</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-300">
                {batteryState.isCharging ? <BatteryCharging size={13} className="text-green-400" /> : <Battery size={13} className={batteryState.isLowBattery ? "text-red-400" : "text-neutral-400"} />}
                <span>{Math.round(batteryState.level * 100)}%</span>
              </div>
            </div>

            <ChevronDown size={14} className="text-neutral-400" />
          </div>
        ) : (
          /* EXPANDED DETAILED CARD VIEW */
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff4800]" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-display">
                  Origin Island Live Status
                </span>
              </div>

              <div className="flex items-center gap-2">
                {batteryState.isUltraMode && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#ff4800] text-black">
                    Ultra Nav Mode
                  </span>
                )}
                <ChevronUp size={16} className="text-neutral-400" />
              </div>
            </div>

            {/* Next Turn Instruction */}
            <div className="flex items-start gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="p-2.5 rounded-xl bg-[#ff4800]/20 border border-[#ff4800]/30 flex-shrink-0">
                {getManeuverIcon(maneuver, 26)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white font-display">
                    {formatDistance(distanceToTurn)}
                  </span>
                  <span className="text-xs text-[#ff4800] font-medium uppercase tracking-wide">
                    {navProgress.status === 'rerouting' ? 'Recalculating...' : 'Next Turn'}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-medium line-clamp-2 mt-0.5">
                  {instruction}
                </p>
              </div>
            </div>

            {/* Metrics Row: ETA, Distance, Speed, Sensor Mode */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">ETA</span>
                <span className="text-sm font-bold text-white font-display">
                  {formatTime(navProgress.remainingDurationSeconds)}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Distance</span>
                <span className="text-sm font-bold text-white font-display">
                  {formatDistance(navProgress.remainingDistanceMeters)}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Speed</span>
                <span className="text-sm font-bold text-white font-display">
                  {Math.round(posState.speed * 3.6)} km/h
                </span>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Positioning</span>
                <span className={`text-[11px] font-bold font-display ${posState.isSensorAssisted ? 'text-cyan-400' : 'text-green-400'}`}>
                  {posState.isSensorAssisted ? 'IMU Sensor' : 'GPS Fix'}
                </span>
              </div>
            </div>

            {/* Status alerts banner */}
            {posState.isSensorAssisted && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[11px]">
                <Cpu size={14} className="flex-shrink-0 text-cyan-400" />
                <span>GPS weak / lost — Dead reckoning position fusion active.</span>
              </div>
            )}

            {navProgress.isOffRouteDetected && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px]">
                <ShieldAlert size={14} className="flex-shrink-0 text-amber-400" />
                <span>Missed turn detected — Instant offline rerouting engaged.</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <Compass size={13} className="text-neutral-500" />
                <span>Heading: {Math.round(posState.heading)}°</span>
              </div>

              {onToggleUltraMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleUltraMode();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    batteryState.isUltraMode
                      ? 'bg-neutral-800 text-white border border-white/20'
                      : 'bg-[#ff4800]/20 hover:bg-[#ff4800]/30 text-[#ff4800] border border-[#ff4800]/40'
                  }`}
                >
                  <Zap size={13} />
                  <span>{batteryState.isUltraMode ? 'Exit Ultra Mode' : 'Ultra Nav Mode'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
