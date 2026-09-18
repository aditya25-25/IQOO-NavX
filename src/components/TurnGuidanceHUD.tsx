import React from 'react';
import { 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  Navigation, 
  Radio, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Square 
} from 'lucide-react';
import { ManeuverType, PositionState, Route } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface TurnGuidanceHUDProps {
  progress: NavigationProgress;
  posState: PositionState;
  activeRoute: Route | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onStopNav: () => void;
  onReroute: () => void;
}

export const TurnGuidanceHUD: React.FC<TurnGuidanceHUDProps> = ({
  progress,
  posState,
  activeRoute,
  isMuted,
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
        return <CornerUpLeft size={34} className="text-[#ff4800]" />;
      case 'turn-right':
      case 'sharp-right':
        return <CornerUpRight size={34} className="text-[#ff4800]" />;
      case 'slight-left':
        return <CornerUpLeft size={34} className="text-[#ff4800] -rotate-12" />;
      case 'slight-right':
        return <CornerUpRight size={34} className="text-[#ff4800] rotate-12" />;
      case 'arrive':
        return <Navigation size={34} className="text-[#00e676]" />;
      default:
        return <ArrowUp size={34} className="text-[#ff4800]" />;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  return (
    <div className="w-full px-4 pt-1 z-40 select-none">
      <div className="glass-panel p-4 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background glow strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff4800] to-transparent opacity-80" />

        <div className="flex items-center justify-between gap-4">
          {/* Maneuver Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ff4800]/15 border border-[#ff4800]/30 flex-shrink-0 shadow-lg">
            {renderManeuverIcon(maneuver)}
          </div>

          {/* Turn text & distance */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white tracking-tight font-display">
                {formatDistance(distance)}
              </span>
              <span className="text-xs uppercase font-bold text-[#ff4800] tracking-wider">
                {progress.status === 'rerouting' ? 'REROUTING...' : 'THEN'}
              </span>
            </div>
            <p className="text-sm font-semibold text-neutral-200 truncate mt-0.5">
              {instruction?.instruction || 'Continue on route'}
            </p>
          </div>

          {/* Controls: Mute, Reroute, Stop */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
            >
              {isMuted ? <VolumeX size={18} className="text-neutral-400" /> : <Volume2 size={18} className="text-[#ff4800]" />}
            </button>

            <button
              onClick={onReroute}
              title="Recalculate offline route"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
            >
              <RotateCcw size={18} className={progress.status === 'rerouting' ? 'animate-spin text-amber-400' : ''} />
            </button>

            <button
              onClick={onStopNav}
              title="Stop navigation"
              className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
            >
              <Square size={18} />
            </button>
          </div>
        </div>

        {/* Lane Guidance Indicators if present */}
        {instruction?.laneInfo && (
          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mr-1">
              Lanes:
            </span>
            {Array.from({ length: instruction.laneInfo.totalLanes }).map((_, idx) => {
              const isActive = instruction.laneInfo!.activeLanes.includes(idx);
              return (
                <div
                  key={idx}
                  className={`w-5 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-[#ff4800] text-black border border-white'
                      : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  ↑
                </div>
              );
            })}
          </div>
        )}

        {/* Positioning status pill */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2.5 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Radio size={12} className={posState.isSensorAssisted ? 'text-cyan-400 animate-pulse' : 'text-green-400'} />
            <span className={posState.isSensorAssisted ? 'text-cyan-300 font-semibold' : 'text-neutral-300'}>
              {posState.isSensorAssisted ? 'Sensor-Assisted Dead Reckoning' : 'Reliable GPS Signal'}
            </span>
          </div>

          <span className="text-neutral-400 truncate max-w-[150px]">
            To: {activeRoute?.destinationName}
          </span>
        </div>
      </div>
    </div>
  );
};
