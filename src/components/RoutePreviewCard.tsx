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
  ShieldAlert 
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
    <div className="w-full px-4 pb-2 z-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 rounded-3xl bg-[#10141e]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-3.5">
        {/* Header: Origin -> Destination */}
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 flex-1 pr-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <div className="w-2 h-2 rounded-full bg-neutral-500" />
              <span className="truncate max-w-[200px]">{route.originName || 'Current Location'}</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
              <MapPin size={15} className="text-[#ff4800] flex-shrink-0" />
              <span className="truncate">{route.destinationName}</span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="Cancel Route Preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Telemetry Summary: Distance, ETA, Offline Badge */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-black text-white font-display tracking-tight">
                {distanceKm}
              </span>
              <span className="text-xs text-neutral-400 ml-1 font-semibold">km</span>
            </div>

            <div className="flex items-center gap-1 text-neutral-300 text-xs font-semibold">
              <Clock size={13} className="text-[#ff4800]" />
              <span>{durationMins} min</span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-display bg-green-500/15 text-green-400 border border-green-500/30">
            {route.isOffline ? (
              <>
                <WifiOff size={11} className="text-amber-400" />
                <span className="text-amber-300">Offline Graph Route</span>
              </>
            ) : (
              <>
                <ShieldCheck size={11} className="text-green-400" />
                <span>Online Route</span>
              </>
            )}
          </div>
        </div>

        {/* Factual Route Context Badges */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Route Characteristics:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {context.isHighway && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-[10px] font-semibold text-blue-300">
                <Milestone size={11} className="text-blue-400" />
                <span>NH-44 Outer Ring Highway</span>
              </div>
            )}

            {context.isToll && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[10px] font-semibold text-purple-300">
                <CreditCard size={11} className="text-purple-400" />
                <span>Toll Road</span>
              </div>
            )}

            {context.isPoorConnectivityZone && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-[10px] font-semibold text-rose-300">
                <RadioTower size={11} className="text-rose-400" />
                <span>Poor-Connectivity Underpass</span>
              </div>
            )}

            {context.isUnpaved && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-[10px] font-semibold text-amber-300">
                <AlertTriangle size={11} className="text-amber-400" />
                <span>Unpaved Road</span>
              </div>
            )}

            {context.hasRoadClosure && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-500/50 text-[10px] font-semibold text-red-300">
                <ShieldAlert size={11} className="text-red-400" />
                <span>Road Closure</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-neutral-300 transition-colors"
          >
            Change Destination
          </button>

          <button
            onClick={onStartNavigation}
            className="flex-1 py-3 rounded-2xl bg-[#ff4800] hover:bg-[#ff6524] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ff4800]/30 font-display"
          >
            <Play size={15} className="fill-black" />
            <span>Start Navigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
