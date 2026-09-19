import React from 'react';
import { 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  Navigation, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  X,
  Cpu,
  WifiOff,
  CheckCircle2
} from 'lucide-react';
import { ManeuverType, PositionState, Route } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface TurnGuidanceHUDProps {
  progress: NavigationProgress;
  posState: PositionState;
  activeRoute: Route | null;
  isMuted: boolean;
  isOffline: boolean;
  onToggleMute: () => void;
  onStopNav: () => void;
  onReroute: () => void;
}

export const TurnGuidanceHUD: React.FC<TurnGuidanceHUDProps> = ({
  progress,
  posState,
  activeRoute,
  isMuted,
  isOffline,
  onToggleMute,
  onStopNav,
  onReroute,
}) => {
  if (progress.status !== 'navigating' && progress.status !== 'rerouting') {
    return null;
  }

  const instruction = progress.currentInstruction;
  const maneuver = instruction?.maneuver || 'straight';
  const distance = progress.distanceToNextTurnMeters;

  const renderManeuverIcon = (type: ManeuverType) => {
    switch (type) {
      case 'turn-left':
      case 'sharp-left':
        return <CornerUpLeft size={36} className="text-[#ff4800]" strokeWidth={2.5} />;
      case 'turn-right':
      case 'sharp-right':
        return <CornerUpRight size={36} className="text-[#ff4800]" strokeWidth={2.5} />;
      case 'slight-left':
        return <CornerUpLeft size={36} className="text-[#ff4800] -rotate-12" strokeWidth={2.5} />;
      case 'slight-right':
        return <CornerUpRight size={36} className="text-[#ff4800] rotate-12" strokeWidth={2.5} />;
      case 'arrive':
        return <Navigation size={36} className="text-[#00e676]" strokeWidth={2.5} />;
      default:
        return <ArrowUp size={36} className="text-[#ff4800]" strokeWidth={2.5} />;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  return (
    <div className="w-full px-4 pt-1 z-40 select-none animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="p-4 rounded-3xl bg-[#0f131f]/95 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden space-y-3">
        {/* Glow Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff4800] to-transparent opacity-90" />

        {/* Top Info & Action Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Turn Maneuver Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ff4800]/15 border border-[#ff4800]/40 flex-shrink-0 shadow-lg shadow-[#ff4800]/20">
            {renderManeuverIcon(maneuver)}
          </div>

          {/* Turn Instruction Text & Distance */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white tracking-tight font-display">
                {formatDistance(distance)}
              </span>
              <span className="text-xs uppercase font-extrabold text-[#ff4800] tracking-wider font-display">
                {progress.status === 'rerouting' ? 'REROUTING OFFLINE...' : 'THEN'}
              </span>
            </div>
            <p className="text-sm font-bold text-white truncate mt-0.5">
              {instruction?.instruction || 'Continue along route'}
            </p>
            {instruction?.roadName && (
              <span className="text-[11px] text-neutral-400 font-medium truncate block">
                on {instruction.roadName}
              </span>
            )}
          </div>

          {/* Controls: Mute, Reroute, Stop */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute voice guidance' : 'Mute voice guidance'}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
            >
              {isMuted ? <VolumeX size={18} className="text-neutral-400" /> : <Volume2 size={18} className="text-[#ff4800]" />}
            </button>

            <button
              onClick={onReroute}
              title="Force offline reroute"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
            >
              <RotateCcw size={18} className={progress.status === 'rerouting' ? 'animate-spin text-amber-400' : ''} />
            </button>

            <button
              onClick={onStopNav}
              title="Cancel navigation"
              className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Lane Guidance Indicators */}
        {instruction?.laneInfo && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mr-1">
              Lane Assist:
            </span>
            {Array.from({ length: instruction.laneInfo.totalLanes }).map((_, idx) => {
              const isActive = instruction.laneInfo!.activeLanes.includes(idx);
              return (
                <div
                  key={idx}
                  className={`w-5 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-[#ff4800] text-black border border-white shadow-md'
                      : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  ↑
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Status Badges Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
          {/* Left: Sensor or GPS status */}
          <div className="flex items-center gap-1.5">
            {posState.isSensorAssisted ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
                <Cpu size={11} className="text-cyan-400 animate-pulse" />
                <span>SENSOR POSITIONING</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-300 font-bold">
                <CheckCircle2 size={11} className="text-green-400" />
                <span>GPS SIGNAL OK</span>
              </div>
            )}

            {isOffline && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                <WifiOff size={11} className="text-amber-400" />
                <span>OFFLINE NAV</span>
              </div>
            )}
          </div>

          {/* Right: Target destination label */}
          <span className="text-neutral-400 truncate max-w-[140px] font-medium">
            To: {activeRoute?.destinationName}
          </span>
        </div>
      </div>
    </div>
  );
};
