```tsx
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
  Zap,
  ShieldAlert,
} from 'lucide-react';
import { ManeuverType, PositionState, BatteryState } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface OriginIslandProps {
  navProgress: NavigationProgress;
  posState: PositionState;
  batteryState: BatteryState;
  isOffline: boolean;
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

  const getManeuverIcon = (type: ManeuverType, size = 16) => {
    switch (type) {
      case 'turn-left':
      case 'sharp-left':
        return (
          <CornerUpLeft
            size={size}
            className="text-[#FFD400]"
            strokeWidth={2.5}
          />
        );

      case 'turn-right':
      case 'sharp-right':
        return (
          <CornerUpRight
            size={size}
            className="text-[#FFD400]"
            strokeWidth={2.5}
          />
        );

      case 'slight-left':
        return (
          <CornerUpLeft
            size={size}
            className="text-[#FFD400] -rotate-12"
            strokeWidth={2.5}
          />
        );

      case 'slight-right':
        return (
          <CornerUpRight
            size={size}
            className="text-[#FFD400] rotate-12"
            strokeWidth={2.5}
          />
        );

      case 'arrive':
        return (
          <Navigation
            size={size}
            className="text-[#22C55E]"
            strokeWidth={2.5}
          />
        );

      default:
        return (
          <ArrowUp
            size={size}
            className="text-[#FFD400]"
            strokeWidth={2.5}
          />
        );
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

  const isNavigating =
    navProgress.status === 'navigating' ||
    navProgress.status === 'rerouting';

  const maneuver =
    navProgress.currentInstruction?.maneuver || 'straight';

  const instruction =
    navProgress.currentInstruction?.instruction ||
    'Proceed along route';

  const distanceToTurn = navProgress.distanceToNextTurnMeters;

  const isRerouting = navProgress.status === 'rerouting';

  return (
    <div className="relative z-50 flex w-full flex-col items-center px-3 pt-2 select-none">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={
          isExpanded
            ? 'Collapse Origin Island'
            : 'Expand Origin Island navigation status'
        }
        onClick={() => setIsExpanded((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsExpanded((value) => !value);
          }
        }}
        className={[
          'group cursor-pointer border transition-all duration-300 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60',
          batteryState.isUltraMode
            ? 'border-[#2B2F33] bg-[#08090A] text-[#F5F7F8] shadow-[0_8px_24px_rgba(0,0,0,0.45)]'
            : 'border-[#2B2F33] bg-[#111315]/98 text-[#F5F7F8] shadow-[0_12px_36px_rgba(0,0,0,0.55)] hover:border-[#FFD400]/40',
          isExpanded
            ? 'w-full max-w-md rounded-3xl p-4'
            : 'w-auto max-w-[calc(100vw-24px)] rounded-full px-3.5 py-2',
        ].join(' ')}
      >
        {!isExpanded ? (
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Brand / activity indicator */}
            <div className="flex shrink-0 items-center gap-1.5">
              <span
                className={[
                  'h-2 w-2 rounded-full',
                  isRerouting
                    ? 'bg-[#F59E0B] animate-pulse'
                    : 'bg-[#FFD400]',
                ].join(' ')}
              />

              <span className="hidden text-[10px] font-black uppercase tracking-[0.12em] text-[#F5F7F8] sm:inline">
                Origin Island
              </span>
            </div>

            <div className="h-4 w-px shrink-0 bg-[#2B2F33]" />

            {/* Navigation preview */}
            {isNavigating ? (
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#191C1F]">
                  {getManeuverIcon(maneuver, 14)}
                </div>

                <span className="shrink-0 text-xs font-black text-[#F5F7F8]">
                  {formatDistance(distanceToTurn)}
                </span>

                <span className="max-w-[90px] truncate text-[10px] font-medium text-[#A4A9AE] sm:max-w-[120px]">
                  {navProgress.currentInstruction?.roadName || 'Next turn'}
                </span>
              </div>
            ) : (
              <span className="whitespace-nowrap text-xs font-medium text-[#A4A9AE]">
                IQOO NavX Active
              </span>
            )}

            <div className="h-4 w-px shrink-0 bg-[#2B2F33]" />

            {/* Status */}
            <div className="flex shrink-0 items-center gap-1.5">
              {isOffline && (
                <div
                  className="flex items-center gap-1 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-1.5 py-0.5 text-[9px] font-black tracking-wide text-[#F59E0B]"
                  title="Offline navigation"
                >
                  <WifiOff size={9} />
                  <span className="hidden sm:inline">OFFLINE</span>
                </div>
              )}

              {posState.isSensorAssisted && (
                <div
                  className="flex items-center gap-1 rounded-full border border-[#3B82F6]/25 bg-[#3B82F6]/10 px-1.5 py-0.5 text-[9px] font-black tracking-wide text-[#60A5FA]"
                  title="Sensor assisted positioning"
                >
                  <Cpu size={9} />
                  <span className="hidden sm:inline">IMU</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#A4A9AE]">
                {batteryState.isCharging ? (
                  <BatteryCharging
                    size={13}
                    className="text-[#22C55E]"
                  />
                ) : (
                  <Battery
                    size={13}
                    className={
                      batteryState.isLowBattery
                        ? 'text-[#EF4444]'
                        : 'text-[#A4A9AE]'
                    }
                  />
                )}

                <span>{Math.round(batteryState.level * 100)}%</span>
              </div>
            </div>

            <ChevronDown
              size={14}
              className="shrink-0 text-[#6F757B] transition-transform duration-200 group-hover:text-[#A4A9AE]"
            />
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 space-y-3 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2B2F33] pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    'h-2 w-2 rounded-full',
                    isRerouting
                      ? 'bg-[#F59E0B] animate-pulse'
                      : 'bg-[#FFD400]',
                  ].join(' ')}
                />

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#F5F7F8]">
                    Origin Island
                  </p>

                  <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-[#6F757B]">
                    Live navigation status
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {batteryState.isUltraMode && (
                  <span className="rounded-full bg-[#FFD400] px-2 py-1 text-[8px] font-black uppercase tracking-wide text-black">
                    Ultra Nav
                  </span>
                )}

                <ChevronUp
                  size={15}
                  className="text-[#6F757B]"
                />
              </div>
            </div>

            {/* Next maneuver */}
            <div
              className={[
                'flex items-start gap-3 rounded-2xl border p-3',
                isRerouting
                  ? 'border-[#F59E0B]/30 bg-[#F59E0B]/[0.06]'
                  : 'border-[#2B2F33] bg-[#191C1F]',
              ].join(' ')}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#22262A]">
                {getManeuverIcon(maneuver, 24)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-lg font-black tracking-tight text-[#F5F7F8]">
                    {formatDistance(distanceToTurn)}
                  </span>

                  <span
                    className={[
                      'text-[9px] font-black uppercase tracking-[0.1em]',
                      isRerouting
                        ? 'text-[#F59E0B]'
                        : 'text-[#FFD400]',
                    ].join(' ')}
                  >
                    {isRerouting ? 'Recalculating' : 'Next Turn'}
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-[#A4A9AE]">
                  {instruction}
                </p>

                {navProgress.currentInstruction?.roadName && (
                  <p className="mt-1 truncate text-[10px] font-semibold text-[#6F757B]">
                    {navProgress.currentInstruction.roadName}
                  </p>
                )}
              </div>
            </div>

            {/* Telemetry */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-xl border border-[#2B2F33] bg-[#191C1F] p-2.5">
                <span className="block text-[8px] font-black uppercase tracking-wider text-[#6F757B]">
                  ETA
                </span>

                <span className="mt-0.5 block text-xs font-black text-[#F5F7F8]">
                  {formatTime(navProgress.remainingDurationSeconds)}
                </span>
              </div>

              <div className="rounded-xl border border-[#2B2F33] bg-[#191C1F] p-2.5">
                <span className="block text-[8px] font-black uppercase tracking-wider text-[#6F757B]">
                  Remaining
                </span>

                <span className="mt-0.5 block text-xs font-black text-[#F5F7F8]">
                  {formatDistance(navProgress.remainingDistanceMeters)}
                </span>
              </div>

              <div className="rounded-xl border border-[#2B2F33] bg-[#191C1F] p-2.5">
                <span className="block text-[8px] font-black uppercase tracking-wider text-[#6F757B]">
                  Speed
                </span>

                <span className="mt-0.5 block text-xs font-black text-[#F5F7F8]">
                  {Math.round(posState.speed * 3.6)} km/h
                </span>
              </div>

              <div className="rounded-xl border border-[#2B2F33] bg-[#191C1F] p-2.5">
                <span className="block text-[8px] font-black uppercase tracking-wider text-[#6F757B]">
                  Mode
                </span>

                <span
                  className={[
                    'mt-0.5 block truncate text-[10px] font-black',
                    posState.isSensorAssisted
                      ? 'text-[#60A5FA]'
                      : 'text-[#22C55E]',
                  ].join(' ')}
                >
                  {posState.isSensorAssisted
                    ? 'IMU Sensor'
                    : 'GPS Active'}
                </span>
              </div>
            </div>

            {/* Sensor assisted status */}
            {posState.isSensorAssisted && (
              <div className="flex items-center gap-2 rounded-xl border border-[#3B82F6]/25 bg-[#3B82F6]/10 p-2.5 text-[10px] font-medium text-[#A4A9AE]">
                <Cpu
                  size={14}
                  className="shrink-0 text-[#3B82F6]"
                />

                <span>
                  GPS weak — 6-DOF IMU dead reckoning active.
                </span>
              </div>
            )}

            {/* Off-route status */}
            {navProgress.isOffRouteDetected && (
              <div className="flex items-center gap-2 rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/10 p-2.5 text-[10px] font-medium text-[#A4A9AE]">
                <ShieldAlert
                  size={14}
                  className="shrink-0 text-[#F59E0B]"
                />

                <span>
                  Missed turn — instant offline rerouting engaged.
                </span>
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-[#2B2F33] pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#A4A9AE]">
                <Compass
                  size={13}
                  className="text-[#6F757B]"
                />

                <span>
                  Heading: {Math.round(posState.heading)}°
                </span>
              </div>

              {onToggleUltraMode && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleUltraMode();
                  }}
                  aria-label={
                    batteryState.isUltraMode
                      ? 'Exit Ultra Navigation Mode'
                      : 'Enable Ultra Navigation Mode'
                  }
                  className={[
                    'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wide transition-all duration-200',
                    'active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60',
                    batteryState.isUltraMode
                      ? 'border border-[#2B2F33] bg-[#22262A] text-[#F5F7F8] hover:border-[#FFD400]/40'
                      : 'bg-[#FFD400] text-black hover:bg-[#e6bf00]',
                  ].join(' ')}
                >
                  <Zap size={12} />

                  <span>
                    {batteryState.isUltraMode
                      ? 'Exit Ultra Mode'
                      : 'Ultra Nav Mode'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```
