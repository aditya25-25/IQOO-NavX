import React from 'react';
import {
  Search,
  Mic,
  MapPin,
  Home,
  GraduationCap,
  Building2,
  Cross,
  Fuel,
  Train,
  Radio,
  Sparkles,
  Settings,
  ChevronRight,
  BatteryCharging,
  Download,
  Navigation,
  WifiOff,
} from 'lucide-react';
import {
  MapRegion,
  POI,
  PositionState,
  BatteryState,
} from '../types';

interface HomeScreenOverlayProps {
  activeRegion: MapRegion;
  savedLocations: POI[];
  posState: PositionState;
  batteryState?: BatteryState;
  isOffline: boolean;
  onOpenSearch: () => void;
  onOpenVoice: () => void;
  onOpenSavedLocations: () => void;
  onOpenDownloadRegion: () => void;
  onSelectDestination: (poi: POI) => void;
  onOpenEngineDrawer: () => void;
}

export const HomeScreenOverlay: React.FC<HomeScreenOverlayProps> = ({
  activeRegion,
  savedLocations,
  posState,
  batteryState,
  isOffline,
  onOpenSearch,
  onOpenVoice,
  onOpenSavedLocations,
  onOpenDownloadRegion,
  onSelectDestination,
  onOpenEngineDrawer,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return (
          <GraduationCap
            size={17}
            strokeWidth={2.2}
            className="text-[#C8FF00]"
          />
        );

      case 'home':
        return (
          <Home
            size={17}
            strokeWidth={2.2}
            className="text-[#C8FF00]"
          />
        );

      case 'work':
      case 'tech_park':
        return (
          <Building2
            size={17}
            strokeWidth={2.2}
            className="text-[#C8FF00]"
          />
        );

      case 'hospital':
        return (
          <Cross
            size={17}
            strokeWidth={2.2}
            className="text-[#C8FF00]"
          />
        );

      case 'fuel':
        return (
          <Fuel
            size={17}
            strokeWidth={2.2}
            className="text-[#C8FF00]"
          />
        );

      case 'transit':
        return (
          <Train
            size={17}
            strokeWidth={2.2}
            className="text-[#C8FF00]"
          />
        );

      default:
        return (
          <MapPin
            size={17}
            strokeWidth={2.2}
            className="text-[#C8FF00]"
          />
        );
    }
  };

  const quickPois =
    savedLocations.length > 0
      ? savedLocations.slice(0, 4)
      : activeRegion.pois.filter((p) => p.isSaved).slice(0, 4);

  const batteryPercent = batteryState
    ? Math.round(batteryState.level * 100)
    : 85;

  const currentLocation =
    posState.currentPosition
      ? `${posState.currentPosition.lat.toFixed(4)}, ${posState.currentPosition.lng.toFixed(4)}`
      : 'Current location';

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none font-sans">
      {/* =========================================================
          TOP HEADER
      ========================================================== */}
      <div className="absolute top-0 left-0 right-0 px-4 pt-4 pointer-events-auto">
        <div className="flex items-start justify-between">
          {/* NavX Brand */}
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[25px] font-black tracking-[-1.5px] text-white">
                iQOO
              </span>

              <span className="text-[25px] font-black tracking-[-1px] text-[#C8FF00]">
                NavX
              </span>

              <span className="ml-1 text-[#C8FF00] text-xl font-black">
                X
              </span>
            </div>

            <p className="mt-[-2px] text-[10px] font-semibold tracking-[2px] uppercase text-white/55">
              Navigate Beyond
            </p>
          </div>

          {/* Status + Settings */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#090B0C]/90 px-3 py-2 backdrop-blur-xl">
              <span
                className={`h-2 w-2 rounded-full ${
                  isOffline ? 'bg-[#C8FF00]' : 'bg-green-400'
                }`}
              />

              <span className="text-[10px] font-bold text-white/80">
                {isOffline ? 'OFFLINE READY' : 'ONLINE'}
              </span>
            </div>

            <button
              onClick={onOpenEngineDrawer}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#090B0C]/90 text-white/75 backdrop-blur-xl transition-all hover:border-[#C8FF00]/50 hover:text-[#C8FF00] active:scale-95"
              title="NavX settings"
            >
              <Settings size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          SEARCH BAR
      ========================================================== */}
      <div className="absolute top-[88px] left-4 right-4 pointer-events-auto">
        <button
          onClick={onOpenSearch}
          className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#101315]/95 px-4 py-3.5 text-left shadow-2xl backdrop-blur-xl transition-all hover:border-[#C8FF00]/40 active:scale-[0.99]"
        >
          <Search
            size={20}
            className="shrink-0 text-white/55 transition-colors group-hover:text-[#C8FF00]"
          />

          <span className="flex-1 text-[14px] font-medium text-white/55">
            Search destination...
          </span>

          <div className="h-6 w-px bg-white/10" />

          <button
            onClick={(event) => {
              event.stopPropagation();
              onOpenVoice();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C8FF00] text-black transition-all hover:bg-[#d8ff3c] active:scale-90"
            title="AI Voice Navigation"
          >
            <Mic size={17} strokeWidth={2.5} />
          </button>
        </button>
      </div>

      {/* =========================================================
          LOCATION / MAP STATUS CARD
      ========================================================== */}
      <div className="absolute top-[148px] left-4 right-4 pointer-events-auto">
        <div className="rounded-2xl border border-white/10 bg-[#090B0C]/85 p-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Location indicator */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C8FF00]/10">
              <span className="absolute h-7 w-7 animate-pulse rounded-full border border-[#C8FF00]/30" />

              <MapPin
                size={20}
                className="relative z-10 text-[#C8FF00]"
                fill="currentColor"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                Current Location
              </p>

              <p className="truncate text-[12px] font-bold text-white">
                {currentLocation}
              </p>
            </div>

            {/* GPS status */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Radio
                  size={12}
                  className={
                    posState.isSensorAssisted
                      ? 'text-[#C8FF00]'
                      : 'text-green-400'
                  }
                />

                <span className="text-[10px] font-bold text-white/75">
                  {posState.isSensorAssisted
                    ? '6-DOF'
                    : 'GPS ACTIVE'}
                </span>
              </div>

              <p className="mt-0.5 text-[9px] text-white/40">
                Sensor-assisted positioning
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM DASHBOARD
      ========================================================== */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <div className="rounded-t-[28px] border-t border-white/10 bg-[#080A0B]/97 px-4 pb-4 pt-4 shadow-[0_-20px_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl">

          {/* Battery + Offline status */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C8FF00]/10">
                {isOffline ? (
                  <WifiOff size={15} className="text-[#C8FF00]" />
                ) : (
                  <Navigation size={15} className="text-[#C8FF00]" />
                )}
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-wider text-white/40">
                  Navigation
                </p>

                <p className="text-[11px] font-bold text-white">
                  {isOffline
                    ? 'Offline navigation ready'
                    : 'Online navigation active'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <BatteryCharging
                size={15}
                className="text-[#C8FF00]"
              />

              <span className="text-[11px] font-bold text-white">
                {batteryPercent}%
              </span>
            </div>
          </div>

          {/* =====================================================
              PRIMARY NAVIGATE BUTTON
          ====================================================== */}
          <button
            onClick={onOpenSearch}
            className="group mb-3 flex w-full items-center justify-between rounded-2xl bg-[#C8FF00] px-4 py-3.5 text-black shadow-[0_8px_30px_rgba(200,255,0,0.18)] transition-all hover:bg-[#d8ff3c] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/10">
                <Navigation
                  size={19}
                  fill="currentColor"
                  strokeWidth={2.5}
                />
              </div>

              <div className="text-left">
                <p className="text-[14px] font-black">
                  Navigate Offline
                </p>

                <p className="text-[9px] font-semibold text-black/55">
                  No continuous internet required
                </p>
              </div>
            </div>

            <ChevronRight
              size={21}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          {/* =====================================================
              QUICK ACTIONS
          ====================================================== */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {/* Home */}
            <QuickAction
              icon={<Home size={17} />}
              label="Home"
              onClick={() => {
                const poi = activeRegion.pois.find(
                  (p) => p.category === 'home'
                );

                if (poi) onSelectDestination(poi);
              }}
            />

            {/* College */}
            <QuickAction
              icon={<GraduationCap size={17} />}
              label="College"
              onClick={() => {
                const poi = activeRegion.pois.find(
                  (p) => p.category === 'college'
                );

                if (poi) onSelectDestination(poi);
              }}
            />

            {/* Fuel */}
            <QuickAction
              icon={<Fuel size={17} />}
              label="Fuel"
              onClick={() => {
                const poi = activeRegion.pois.find(
                  (p) => p.category === 'fuel'
                );

                if (poi) onSelectDestination(poi);
              }}
            />

            {/* Saved */}
            <QuickAction
              icon={<Sparkles size={17} />}
              label="Saved"
              onClick={onOpenSavedLocations}
            />
          </div>

          {/* =====================================================
              RECENT DESTINATIONS
          ====================================================== */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-white">
                Recent Destinations
              </h3>

              <p className="mt-0.5 text-[9px] text-white/35">
                Quick access to your places
              </p>
            </div>

            <button
              onClick={onOpenSavedLocations}
              className="text-[10px] font-bold text-[#C8FF00] transition-colors hover:text-white"
            >
              View all
            </button>
          </div>

          <div className="mb-3 overflow-hidden rounded-2xl border border-white/8 bg-[#101315]">
            {quickPois.length > 0 ? (
              quickPois.slice(0, 3).map((poi, index) => (
                <button
                  key={poi.id}
                  onClick={() => onSelectDestination(poi)}
                  className={`group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5 ${
                    index !== 0
                      ? 'border-t border-white/5'
                      : ''
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C8FF00]/8">
                    {getCategoryIcon(poi.category)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-white">
                      {poi.name}
                    </p>

                    <p className="truncate text-[9px] text-white/35">
                      {poi.category.replace('_', ' ')}
                    </p>
                  </div>

                  <ChevronRight
                    size={15}
                    className="text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-[#C8FF00]"
                  />
                </button>
              ))
            ) : (
              <button
                onClick={onOpenSearch}
                className="flex w-full items-center gap-3 px-3 py-3 text-left"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C8FF00]/8">
                  <Search
                    size={16}
                    className="text-[#C8FF00]"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-white">
                    Find your first destination
                  </p>

                  <p className="text-[9px] text-white/35">
                    Search for a place to navigate
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* =====================================================
              AI VOICE ASSISTANT
          ====================================================== */}
          <button
            onClick={onOpenVoice}
            className="group mb-2 flex w-full items-center gap-3 rounded-2xl border border-[#C8FF00]/15 bg-gradient-to-r from-[#121610] to-[#101315] p-3 text-left transition-all hover:border-[#C8FF00]/40 hover:bg-[#151A12] active:scale-[0.99]"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C8FF00] text-black shadow-[0_0_22px_rgba(200,255,0,0.18)]">
              <Mic size={19} strokeWidth={2.5} />

              <span className="absolute inset-[-4px] rounded-full border border-[#C8FF00]/20" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[12px] font-black text-white">
                  AI Voice Assistant
                </p>

                <span className="rounded-full bg-[#C8FF00]/10 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-[#C8FF00]">
                  AI
                </span>
              </div>

              <p className="mt-0.5 truncate text-[9px] text-white/40">
                “Hey NavX, take me home”
              </p>
            </div>

            <ChevronRight
              size={17}
              className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[#C8FF00]"
            />
          </button>

          {/* =====================================================
              NAVX ENGINE
          ====================================================== */}
          <button
            onClick={onOpenEngineDrawer}
            className="flex w-full items-center justify-center gap-2 py-1.5 text-[9px] font-bold uppercase tracking-[1.5px] text-white/30 transition-colors hover:text-[#C8FF00]"
          >
            <Sparkles size={11} />
            <span>NavX Sensor & AI Engine</span>
          </button>

          {/* =====================================================
              OFFLINE MAP DOWNLOAD
          ====================================================== */}
          <button
            onClick={onOpenDownloadRegion}
            className="mx-auto flex items-center gap-1.5 text-[8px] font-semibold text-white/25 transition-colors hover:text-white/55"
          >
            <Download size={10} />
            Manage offline maps
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===============================================================
   QUICK ACTION COMPONENT
================================================================ */

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/8 bg-[#101315] px-2 py-2.5 transition-all hover:border-[#C8FF00]/30 hover:bg-[#151914] active:scale-95"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C8FF00]/8 text-[#C8FF00] transition-colors group-hover:bg-[#C8FF00] group-hover:text-black">
        {icon}
      </div>

      <span className="truncate text-[9px] font-bold text-white/65 group-hover:text-white">
        {label}
      </span>
    </button>
  );
};

export default HomeScreenOverlay;
