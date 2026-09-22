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
  CheckCircle2,
  Mic,
  Route as RouteIcon,
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
  onOpenVoice: () => void;
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
  onOpenVoice,
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
        return (
          <CornerUpLeft
            size={38}
            className="text-[#FFD400]"
            strokeWidth={2.5}
          />
        );

      case 'turn-right':
      case 'sharp-right':
        return (
          <CornerUpRight
            size={38}
            className="text-[#FFD400]"
            strokeWidth={2.5}
          />
        );

      case 'slight-left':
        return (
          <CornerUpLeft
            size={38}
            className="text-[#FFD400] -rotate-12"
            strokeWidth={2.5}
          />
        );

      case 'slight-right':
        return (
          <CornerUpRight
            size={38}
            className="text-[#FFD400] rotate-12"
            strokeWidth={2.5}
          />
        );

      case 'arrive':
        return (
          <Navigation
            size={38}
            className="text-[#22C55E]"
            strokeWidth={2.5}
          />
        );

      default:
        return (
          <ArrowUp
            size={38}
            className="text-[#FFD400]"
            strokeWidth={2.5}
          />
        );
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  };

  const getManeuverTitle = (type: ManeuverType) => {
    switch (type) {
      case 'turn-left':
        return 'TURN LEFT';
      case 'turn-right':
        return 'TURN RIGHT';
      case 'slight-left':
        return 'SLIGHT LEFT';
      case 'slight-right':
        return 'SLIGHT RIGHT';
      case 'sharp-left':
        return 'SHARP LEFT';
      case 'sharp-right':
        return 'SHARP RIGHT';
      case 'arrive':
        return 'ARRIVING AT DESTINATION';
      default:
        return 'PROCEED STRAIGHT';
    }
  };

  const isRerouting = progress.status === 'rerouting';

  return (
    <div className="w-full px-3 sm:px-4 pt-2 z-40 select-none animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="w-full max-w-3xl mx-auto bg-[#111315] border border-[#2B2F33] rounded-[26px] shadow-[0_12px_36px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Top Accent */}
        <div
          className={`h-1 w-full ${
            isRerouting ? 'bg-[#F59E0B]' : 'bg-[#FFD400]'
          }`}
        />

        <div className="p-3.5 sm:p-4 space-y-3">
          {/* Main Guidance */}
          <div className="flex items-center gap-3">
            {/* Maneuver */}
            <div
              className={`h-[68px] w-[68px] rounded-2xl border flex items-center justify-center flex-shrink-0 ${
                maneuver === 'arrive'
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/25'
                  : 'bg-[#191C1F] border-[#2B2F33]'
              }`}
            >
              {renderManeuverIcon(maneuver)}
            </div>

            {/* Instruction */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase tracking-[0.12em] font-black font-display ${
                    isRerouting ? 'text-[#F59E0B]' : 'text-[#FFD400]'
                  }`}
                >
                  {isRerouting
                    ? 'REROUTING OFFLINE'
                    : getManeuverTitle(maneuver)}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-[26px] leading-none font-black text-[#F5F7F8] tracking-tight font-display">
                  {formatDistance(distance)}
                </span>

                <span className="text-[10px] text-[#6F757B] font-semibold">
                  ahead
                </span>
              </div>

              <p className="text-xs font-bold text-[#F5F7F8] truncate mt-1">
                {instruction?.roadName || 'MG Road / Outer Ring Link'}
              </p>

              <p className="text-[10px] text-[#A4A9AE] truncate mt-0.5">
                {instruction?.instruction || 'Continue on route'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onOpenVoice}
                title="Voice navigation"
                aria-label="Voice navigation"
                className="h-10 w-10 rounded-xl bg-[#FFD400] text-black flex items-center justify-center hover:bg-[#F5C900] active:scale-95 transition-all"
              >
                <Mic size={16} />
              </button>

              <button
                onClick={onToggleMute}
                title={isMuted ? 'Unmute voice' : 'Mute voice'}
                aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
                className="h-10 w-10 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#A4A9AE] hover:text-[#F5F7F8] hover:bg-[#22262A] active:scale-95 transition-all"
              >
                {isMuted ? (
                  <VolumeX size={16} />
                ) : (
                  <Volume2 size={16} className="text-[#FFD400]" />
                )}
              </button>

              <button
                onClick={onReroute}
                title="Recalculate route"
                aria-label="Recalculate route"
                className="h-10 w-10 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#A4A9AE] hover:text-[#F5F7F8] hover:bg-[#22262A] active:scale-95 transition-all"
              >
                <RotateCcw
                  size={16}
                  className={
                    isRerouting ? 'animate-spin text-[#F59E0B]' : ''
                  }
                />
              </button>

              <button
                onClick={onStopNav}
                title="Exit navigation"
                aria-label="Exit navigation"
                className="h-10 w-10 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/25 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444]/20 active:scale-95 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Lane Guidance */}
          {instruction?.laneInfo && (
            <div className="pt-3 border-t border-[#2B2F33]">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold text-[#6F757B] tracking-[0.12em] whitespace-nowrap">
                  Lane guidance
                </span>

                <div className="h-px flex-1 bg-[#2B2F33]" />

                <div className="flex items-center gap-1">
                  {Array.from({
                    length: instruction.laneInfo.totalLanes,
                  }).map((_, idx) => {
                    const isActive =
                      instruction.laneInfo!.activeLanes.includes(idx);

                    return (
                      <div
                        key={idx}
                        className={`w-6 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${
                          isActive
                            ? 'bg-[#FFD400] text-black border-[#FFD400]'
                            : 'bg-[#191C1F] text-[#6F757B] border-[#2B2F33]'
                        }`}
                      >
                        ↑
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Status */}
          <div className="pt-3 border-t border-[#2B2F33] flex items-center gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {posState.isSensorAssisted ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                  <Cpu
                    size={11}
                    className="text-[#3B82F6] animate-pulse"
                  />
                  <span className="text-[9px] font-bold text-[#60A5FA]">
                    SENSOR ASSISTED
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
                  <CheckCircle2 size={11} className="text-[#22C55E]" />
                  <span className="text-[9px] font-bold text-[#4ADE80]">
                    GPS ACTIVE
                  </span>
                </div>
              )}

              {isOffline && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                  <WifiOff size={11} className="text-[#F59E0B]" />
                  <span className="text-[9px] font-bold text-[#FBBF24]">
                    OFFLINE
                  </span>
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1.5 min-w-0">
              <RouteIcon size={11} className="text-[#6F757B] flex-shrink-0" />
              <span className="text-[10px] text-[#A4A9AE] truncate max-w-[150px]">
                {activeRoute?.destinationName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
