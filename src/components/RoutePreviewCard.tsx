```tsx
import React from 'react';
import { Route, RouteContextInfo } from '../types';
import {
  Play,
  X,
  MapPin,
  Clock,
  Milestone,
  ShieldCheck,
  WifiOff,
  CreditCard,
  AlertTriangle,
  RadioTower,
  ShieldAlert,
  Route as RouteIcon,
} from 'lucide-react';

interface RoutePreviewCardProps {
  route: Route;
  onStartNavigation: () => void;
  onCancel: () => void;
}

export const RoutePreviewCard: React.FC<RoutePreviewCardProps> = ({
  route,
  onStartNavigation,
  onCancel,
}) => {
  const distanceKm = (route.totalDistanceMeters / 1000).toFixed(1);
  const durationMins = Math.ceil(route.totalDurationSeconds / 60);

  const context: RouteContextInfo = route.context || {
    isHighway: false,
    isToll: false,
    isUnpaved: false,
    isRestricted: false,
    hasRoadClosure: false,
    isPoorConnectivityZone: false,
    details: [],
  };

  return (
    <div className="w-full px-4 pb-3 z-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-5 rounded-[26px] bg-[#111315] border border-[#2B2F33] shadow-[0_-8px_32px_rgba(0,0,0,0.45)] space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0">
            <RouteIcon size={18} className="text-[#FFD400]" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-[0.14em] font-bold text-[#6F757B]">
              Route preview
            </p>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] flex-shrink-0" />
              <span className="text-[10px] text-[#A4A9AE] truncate">
                {route.originName || 'Current Location'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={14} className="text-[#FFD400] flex-shrink-0" />
              <h2 className="text-base font-bold text-[#F5F7F8] font-display truncate">
                {route.destinationName}
              </h2>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="h-9 w-9 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#A4A9AE] hover:bg-[#22262A] hover:text-[#F5F7F8] active:scale-95 transition-all flex-shrink-0"
            title="Cancel Preview"
            aria-label="Close route preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main Route Summary */}
        <div className="grid grid-cols-[1fr_auto] gap-3 p-3.5 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
          <div className="flex items-end gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-wide font-bold text-[#6F757B] mb-0.5">
                Distance
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-[#F5F7F8] font-display">
                  {distanceKm}
                </span>
                <span className="text-xs font-semibold text-[#A4A9AE]">
                  km
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-[#2B2F33]" />

            <div>
              <p className="text-[9px] uppercase tracking-wide font-bold text-[#6F757B] mb-1">
                Estimated time
              </p>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#FFD400]" />
                <span className="text-sm font-bold text-[#F5F7F8]">
                  {durationMins} min
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {route.isOffline ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                <WifiOff size={12} className="text-[#F59E0B]" />
                <span className="text-[9px] font-bold text-[#F59E0B]">
                  OFFLINE
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20">
                <ShieldCheck size={12} className="text-[#22C55E]" />
                <span className="text-[9px] font-bold text-[#22C55E]">
                  ONLINE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Route Context */}
        {(context.isHighway ||
          context.isToll ||
          context.isPoorConnectivityZone ||
          context.isUnpaved ||
          context.hasRoadClosure) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-[0.14em] font-bold text-[#6F757B]">
                Route context
              </span>

              <span className="text-[9px] text-[#6F757B]">
                {[
                  context.isHighway,
                  context.isToll,
                  context.isPoorConnectivityZone,
                  context.isUnpaved,
                  context.hasRoadClosure,
                ].filter(Boolean).length}{' '}
                alert
                {[
                  context.isHighway,
                  context.isToll,
                  context.isPoorConnectivityZone,
                  context.isUnpaved,
                  context.hasRoadClosure,
                ].filter(Boolean).length !== 1
                  ? 's'
                  : ''}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {context.isHighway && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[10px] font-semibold text-[#93C5FD]">
                  <Milestone size={12} className="text-[#3B82F6]" />
                  <span>Highway</span>
                </div>
              )}

              {context.isToll && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 text-[10px] font-semibold text-[#C4B5FD]">
                  <CreditCard size={12} className="text-[#A78BFA]" />
                  <span>Toll Road</span>
                </div>
              )}

              {context.isPoorConnectivityZone && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[10px] font-semibold text-[#FCA5A5]">
                  <RadioTower size={12} className="text-[#EF4444]" />
                  <span>Poor Connectivity</span>
                </div>
              )}

              {context.isUnpaved && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[10px] font-semibold text-[#FCD34D]">
                  <AlertTriangle size={12} className="text-[#F59E0B]" />
                  <span>Unpaved Road</span>
                </div>
              )}

              {context.hasRoadClosure && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[10px] font-semibold text-[#FCA5A5]">
                  <ShieldAlert size={12} className="text-[#EF4444]" />
                  <span>Road Closure</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-2 pt-0.5">
          <button
            onClick={onCancel}
            className="h-12 px-4 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] text-[#A4A9AE] hover:text-[#F5F7F8] text-xs font-bold transition-all active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            onClick={onStartNavigation}
            className="flex-1 h-12 rounded-2xl bg-[#FFD400] hover:bg-[#F5C900] text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_8px_22px_rgba(255,212,0,0.18)] transition-all active:scale-[0.99] font-display"
          >
            <Play size={16} className="fill-black" />
            <span>START NAVIGATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
```
