```tsx
import React from 'react';
import {
  X,
  MapPin,
  Navigation,
  Star,
  Mic,
  HardDrive,
  Clock3,
  Route,
} from 'lucide-react';
import { POI, Coordinates } from '../types';
import { getDistanceMeters } from '../engine/offlineRouter';

interface DestinationDetailsModalProps {
  poi: POI | null;
  isOpen: boolean;
  onClose: () => void;
  currentCoord: Coordinates;
  onStartRoute: (poi: POI) => void;
  onToggleSave: (poi: POI) => void;
  onOpenVoice: () => void;
}

export const DestinationDetailsModal: React.FC<
  DestinationDetailsModalProps
> = ({
  poi,
  isOpen,
  onClose,
  currentCoord,
  onStartRoute,
  onToggleSave,
  onOpenVoice,
}) => {
  if (!isOpen || !poi) return null;

  const distanceMeters = getDistanceMeters(currentCoord, poi.coordinate);
  const distanceKm = (distanceMeters / 1000).toFixed(1);
  const durationMins = Math.ceil((distanceMeters / 12) / 60);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111315] border border-[#2B2F33] rounded-t-[28px] sm:rounded-[28px] shadow-[0_-12px_40px_rgba(0,0,0,0.55)] overflow-hidden animate-in slide-in-from-bottom-4 duration-250">
        {/* Mobile Sheet Handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[#2B2F33]" />
        </div>

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0">
              <MapPin size={21} className="text-[#FFD400]" />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#F5F7F8] font-display truncate">
                  {poi.name}
                </h2>

                {poi.isSaved && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FFD400]/10 border border-[#FFD400]/20 text-[8px] font-bold text-[#FFD400] flex-shrink-0">
                    <Star size={8} className="fill-[#FFD400]" />
                    SAVED
                  </span>
                )}
              </div>

              <p className="text-xs text-[#A4A9AE] mt-1 leading-relaxed">
                {poi.address}
              </p>
            </div>

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#A4A9AE] hover:bg-[#22262A] hover:text-[#F5F7F8] active:scale-95 transition-all flex-shrink-0"
              aria-label="Close destination details"
            >
              <X size={17} />
            </button>
          </div>

          {/* Destination Status */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            <span className="text-[10px] font-semibold text-[#F5F7F8]">
              Route available
            </span>
            <span className="text-[10px] text-[#6F757B]">•</span>
            <span className="text-[10px] text-[#A4A9AE]">
              Offline navigation ready
            </span>
          </div>

          {/* Route Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Route size={13} className="text-[#3B82F6]" />
                <span className="text-[9px] uppercase tracking-wide font-bold text-[#6F757B]">
                  Distance
                </span>
              </div>

              <span className="text-sm font-black text-[#F5F7F8] font-display">
                {distanceKm} km
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock3 size={13} className="text-[#FFD400]" />
                <span className="text-[9px] uppercase tracking-wide font-bold text-[#6F757B]">
                  ETA
                </span>
              </div>

              <span className="text-sm font-black text-[#F5F7F8] font-display">
                {durationMins} min
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <HardDrive size={13} className="text-[#22C55E]" />
                <span className="text-[9px] uppercase tracking-wide font-bold text-[#6F757B]">
                  Maps
                </span>
              </div>

              <span className="text-[11px] font-black text-[#22C55E]">
                Offline
              </span>
            </div>
          </div>

          {/* Offline Route Information */}
          <div className="p-3.5 rounded-2xl bg-[#191C1F] border border-[#2B2F33]">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#22262A] flex items-center justify-center flex-shrink-0">
                <HardDrive size={16} className="text-[#FFD400]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#F5F7F8]">
                  Offline route available
                </p>

                <p className="text-[10px] text-[#6F757B] mt-1 leading-relaxed">
                  This destination can be calculated using the downloaded road
                  graph without an active internet connection.
                </p>
              </div>

              <span className="text-[8px] font-black tracking-wide px-2 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] whitespace-nowrap">
                READY
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onStartRoute(poi);
              }}
              className="w-full h-12 rounded-2xl bg-[#FFD400] hover:bg-[#F5C900] text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_8px_22px_rgba(255,212,0,0.18)] active:scale-[0.99] transition-all font-display"
            >
              <Navigation size={17} className="fill-black" />
              <span>START ROUTE</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleSave(poi)}
                className="h-11 rounded-xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] text-[#F5F7F8] text-[11px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <Star
                  size={14}
                  className={
                    poi.isSaved
                      ? 'fill-[#FFD400] text-[#FFD400]'
                      : 'text-[#A4A9AE]'
                  }
                />
                <span>{poi.isSaved ? 'Saved' : 'Save Location'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenVoice();
                }}
                className="h-11 rounded-xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] text-[#F5F7F8] text-[11px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <Mic size={14} className="text-[#FFD400]" />
                <span>Voice Navigation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```
