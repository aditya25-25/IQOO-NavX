import React from 'react';

import {
  Search,
  Mic,
  MapPin,
  Home,
  GraduationCap,
  Building2,
  Fuel,
  Radio,
  Sparkles,
  Settings,
  ChevronRight,
  BatteryCharging,
  Download,
  Navigation,
  WifiOff,
  Bookmark,
  Crosshair,
  Cross,
  CloudOff,
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
  const batteryPercent = batteryState
    ? Math.round(batteryState.level * 100)
    : 85;

  const quickPois =
    savedLocations.length > 0
      ? savedLocations.slice(0, 3)
      : activeRegion.pois
          .filter((p) => p.isSaved)
          .slice(0, 3);

  const getIcon = (category: string) => {
    switch (category) {
      case 'home':
        return <Home size={16} />;

      case 'college':
        return <GraduationCap size={16} />;

      case 'fuel':
        return <Fuel size={16} />;

      case 'hospital':
        return <Cross size={16} />;

      case 'work':
      case 'tech_park':
        return <Building2 size={16} />;

      default:
        return <MapPin size={16} />;
    }
  };

  const findAndNavigate = (category: string) => {
    const poi = activeRegion.pois.find(
      (p) => p.category === category
    );

    if (poi) {
      onSelectDestination(poi);
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none font-sans">

      {/* =====================================================
          TOP BRAND HEADER
      ====================================================== */}

      <div className="absolute top-3 left-3 right-3 pointer-events-auto">
        <div className="flex items-start justify-between">

          <div>
            <div className="flex items-center leading-none">
              <span className="text-[22px] font-black tracking-[-1.3px] text-[#F5F7F8]">
                iQOO
              </span>

              <span className="ml-1 text-[22px] font-black tracking-[-1.3px] text-[#FFD400]">
                NavX
              </span>
            </div>

            <div className="mt-1 text-[7px] font-bold uppercase tracking-[2.2px] text-[#A4A9AE]">
              Navigate Beyond
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* Connection status */}

            <div className="flex items-center gap-1.5 rounded-full border border-[#2B2F33] bg-[#111315]/95 px-2.5 py-1.5 backdrop-blur-md">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOffline
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#22C55E]'
                }`}
              />

              <span className="text-[8px] font-bold tracking-wide text-[#A4A9AE]">
                {isOffline ? 'OFFLINE' : 'ONLINE'}
              </span>
            </div>

            <button
              onClick={onOpenEngineDrawer}
              aria-label="Open NavX Engine"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#111315]/95 text-[#A4A9AE] shadow-lg hover:border-[#3A3F44] hover:text-[#F5F7F8] active:scale-95"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          PRIMARY SEARCH
      ====================================================== */}

      <div className="absolute top-[70px] left-3 right-3 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-2xl border border-[#2B2F33] bg-[#111315]/95 p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur-md">

          <button
            onClick={onOpenSearch}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2.5 py-2.5 text-left hover:bg-white/[0.025] active:scale-[0.99]"
          >
            <Search
              size={18}
              className="shrink-0 text-[#A4A9AE]"
            />

            <div className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-[#A4A9AE]">
                Where to?
              </span>

              <span className="mt-0.5 block truncate text-[7px] text-[#6F757B]">
                Search places, saved destinations or POIs
              </span>
            </div>
          </button>

          <button
            onClick={onOpenVoice}
            aria-label="Voice search"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD400] text-black shadow-[0_6px_20px_rgba(255,212,0,0.18)] hover:bg-[#FFE033] active:scale-90"
          >
            <Mic size={17} strokeWidth={2.6} />
          </button>
        </div>
      </div>

      {/* =====================================================
          POSITIONING STATUS
      ====================================================== */}

      <div className="absolute top-[127px] left-3 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full border border-[#2B2F33] bg-[#111315]/95 px-2.5 py-1.5 shadow-lg backdrop-blur-md">

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3B82F6]/10">
            <Radio
              size={13}
              className={
                posState.isSensorAssisted
                  ? 'text-[#FFD400]'
                  : 'text-[#3B82F6]'
              }
            />
          </div>

          <div>
            <p className="text-[8px] font-bold text-[#F5F7F8]">
              {posState.isSensorAssisted
                ? '6-DOF SENSOR ASSIST'
                : 'GPS ACTIVE'}
            </p>

            <p className="text-[7px] text-[#6F757B]">
              Positioning active
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAP CONTROLS
      ====================================================== */}

      <div className="absolute right-3 top-[174px] flex flex-col gap-2 pointer-events-auto">

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#111315]/95 text-[#A4A9AE] shadow-lg backdrop-blur-md hover:text-[#F5F7F8] active:scale-95"
          title="My location"
          aria-label="My location"
        >
          <Crosshair size={18} />
        </button>

        <div className="overflow-hidden rounded-xl border border-[#2B2F33] bg-[#111315]/95 shadow-lg backdrop-blur-md">

          <button
            className="flex h-10 w-10 items-center justify-center text-[#A4A9AE] hover:text-[#F5F7F8] active:bg-white/5"
            aria-label="Zoom in"
          >
            <span className="text-xl leading-none">+</span>
          </button>

          <div className="mx-2 border-t border-[#2B2F33]" />

          <button
            className="flex h-10 w-10 items-center justify-center text-[#A4A9AE] hover:text-[#F5F7F8] active:bg-white/5"
            aria-label="Zoom out"
          >
            <span className="text-xl leading-none">−</span>
          </button>

        </div>
      </div>

      {/* =====================================================
          CURRENT LOCATION
      ====================================================== */}

      <div className="absolute left-3 bottom-[300px] pointer-events-auto">

        <button
          onClick={onOpenEngineDrawer}
          className="flex items-center gap-3 rounded-2xl border border-[#2B2F33] bg-[#111315]/95 px-3 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.45)] backdrop-blur-md hover:border-[#3A3F44] active:scale-[0.98]"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6]/10">

            <span className="absolute inset-1 rounded-full border border-[#3B82F6]/25 animate-pulse" />

            <MapPin
              size={17}
              className="relative z-10 text-[#3B82F6]"
              fill="currentColor"
            />
          </div>

          <div className="text-left">
            <p className="text-[8px] font-bold uppercase tracking-wider text-[#6F757B]">
              Current Location
            </p>

            <p className="text-[10px] font-semibold text-[#F5F7F8]">
              {posState.isSensorAssisted
                ? 'Sensor-assisted positioning'
                : 'GPS positioning active'}
            </p>
          </div>

          <ChevronRight
            size={15}
            className="text-[#6F757B]"
          />
        </button>
      </div>

      {/* =====================================================
          HOME PANEL
      ====================================================== */}

      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">

        <div className="rounded-t-[26px] border-t border-[#2B2F33] bg-[#111315]/98 px-3 pt-3 pb-3 shadow-[0_-25px_70px_rgba(0,0,0,0.72)] backdrop-blur-md">

          {/* Handle */}

          <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#6F757B]/40" />

          {/* =================================================
              NAVIGATION STATUS
          ================================================== */}

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD400]/10">
                {isOffline ? (
                  <WifiOff
                    size={14}
                    className="text-[#F59E0B]"
                  />
                ) : (
                  <Navigation
                    size={14}
                    className="text-[#FFD400]"
                  />
                )}
              </div>

              <div>
                <p className="text-[7px] uppercase tracking-wider text-[#6F757B]">
                  Navigation
                </p>

                <p className="text-[10px] font-bold text-[#F5F7F8]">
                  {isOffline
                    ? 'Offline navigation ready'
                    : 'Online navigation ready'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <BatteryCharging
                size={14}
                className={
                  batteryPercent <= 20
                    ? 'text-[#EF4444]'
                    : batteryPercent <= 35
                      ? 'text-[#F59E0B]'
                      : 'text-[#22C55E]'
                }
              />

              <span className="text-[10px] font-bold text-[#F5F7F8]">
                {batteryPercent}%
              </span>
            </div>
          </div>

          {/* =================================================
              PRIMARY ACTION
          ================================================== */}

          <button
            onClick={onOpenSearch}
            className="group mb-2 flex w-full items-center justify-between rounded-2xl bg-[#FFD400] px-3.5 py-3 text-black shadow-[0_8px_28px_rgba(255,212,0,0.16)] hover:bg-[#FFE033] active:scale-[0.985]"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/10">
                <Navigation
                  size={18}
                  fill="currentColor"
                  strokeWidth={2.5}
                />
              </div>

              <div className="text-left">
                <p className="text-[13px] font-black">
                  Start Navigation
                </p>

                <p className="text-[8px] font-semibold text-black/50">
                  Search a destination to begin
                </p>
              </div>
            </div>

            <ChevronRight
              size={20}
              strokeWidth={2.5}
            />
          </button>

          {/* =================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="mb-2 grid grid-cols-4 gap-1.5">

            <QuickAction
              icon={<Home size={16} />}
              label="Home"
              onClick={() => findAndNavigate('home')}
            />

            <QuickAction
              icon={<GraduationCap size={16} />}
              label="College"
              onClick={() => findAndNavigate('college')}
            />

            <QuickAction
              icon={<Fuel size={16} />}
              label="Fuel"
              onClick={() => findAndNavigate('fuel')}
            />

            <QuickAction
              icon={<Bookmark size={16} />}
              label="Saved"
              onClick={onOpenSavedLocations}
            />

          </div>

          {/* =================================================
              RECENT DESTINATIONS
          ================================================== */}

          <div className="mb-2 flex items-center justify-between">

            <div>
              <h3 className="text-[12px] font-bold text-[#F5F7F8]">
                Recent Destinations
              </h3>

              <p className="text-[7px] text-[#6F757B]">
                Quick access to your places
              </p>
            </div>

            <button
              onClick={onOpenSavedLocations}
              className="rounded-lg px-2 py-1 text-[9px] font-bold text-[#FFD400] hover:bg-[#FFD400]/10 active:scale-95"
            >
              View all
            </button>
          </div>

          <div className="mb-2 overflow-hidden rounded-2xl border border-[#2B2F33] bg-[#191C1F]">

            {quickPois.length > 0 ? (
              quickPois.map((poi, index) => (
                <button
                  key={poi.id}
                  onClick={() => onSelectDestination(poi)}
                  className={`group flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/[0.025] active:bg-white/5 ${
                    index !== 0
                      ? 'border-t border-[#2B2F33]'
                      : ''
                  }`}
                >

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFD400]/10 text-[#FFD400]">
                    {getIcon(poi.category)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-bold text-[#F5F7F8]">
                      {poi.name}
                    </p>

                    <p className="truncate text-[7px] capitalize text-[#6F757B]">
                      {poi.category.replace('_', ' ')}
                    </p>
                  </div>

                  <ChevronRight
                    size={14}
                    className="text-[#6F757B] transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              ))
            ) : (
              <button
                onClick={onOpenSearch}
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-white/[0.025] active:bg-white/5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD400]/10">
                  <Search
                    size={14}
                    className="text-[#FFD400]"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#F5F7F8]">
                    Find your first destination
                  </p>

                  <p className="text-[7px] text-[#6F757B]">
                    Search for a place to navigate
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* =================================================
              VOICE ASSISTANT
          ================================================== */}

          <button
            onClick={onOpenVoice}
            className="group mb-2 flex w-full items-center gap-3 rounded-2xl border border-[#2B2F33] bg-[#191C1F] p-2.5 text-left hover:border-[#3A3F44] hover:bg-[#22262A] active:scale-[0.99]"
          >

            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD400] text-black">
              <Mic size={17} strokeWidth={2.5} />

              <span className="absolute inset-[-3px] rounded-full border border-[#FFD400]/20" />
            </div>

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-1.5">
                <p className="text-[11px] font-black text-[#F5F7F8]">
                  AI Voice Navigation
                </p>

                <span className="rounded-full border border-[#FFD400]/20 bg-[#FFD400]/10 px-1.5 py-0.5 text-[6px] font-bold text-[#FFD400]">
                  AI
                </span>
              </div>

              <p className="mt-0.5 truncate text-[8px] text-[#6F757B]">
                “Hey NavX, take me home”
              </p>
            </div>

            <ChevronRight
              size={16}
              className="text-[#6F757B] transition-transform group-hover:translate-x-0.5"
            />
          </button>

          {/* =================================================
              OFFLINE / ENGINE QUICK LINKS
          ================================================== */}

          <div className="flex items-center justify-center gap-7">

            <button
              onClick={onOpenSavedLocations}
              className="flex flex-col items-center gap-1 text-[#6F757B] hover:text-[#F5F7F8] active:text-[#FFD400]"
            >
              <Bookmark size={14} />
              <span className="text-[7px]">
                Saved
              </span>
            </button>

            <button
              onClick={onOpenDownloadRegion}
              className="flex flex-col items-center gap-1 text-[#6F757B] hover:text-[#F5F7F8] active:text-[#FFD400]"
            >
              <Download size={14} />
              <span className="text-[7px]">
                Offline Maps
              </span>
            </button>

            <button
              onClick={onOpenEngineDrawer}
              className="flex flex-col items-center gap-1 text-[#6F757B] hover:text-[#F5F7F8] active:text-[#FFD400]"
            >
              <Sparkles size={14} />
              <span className="text-[7px]">
                NavX Engine
              </span>
            </button>
          </div>

          {/* Offline-first indicator */}

          <div className="mt-2 flex items-center justify-center gap-1.5">
            <CloudOff
              size={9}
              className={
                isOffline
                  ? 'text-[#F59E0B]'
                  : 'text-[#6F757B]'
              }
            />

            <span className="text-[6px] uppercase tracking-[1.5px] text-[#6F757B]">
              Offline-first navigation
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};


/* ============================================================
   QUICK ACTION COMPONENT
============================================================ */

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
      className="group flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-[#2B2F33] bg-[#191C1F] px-1.5 py-2 hover:border-[#3A3F44] hover:bg-[#22262A] active:scale-95"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD400]/10 text-[#FFD400] group-hover:bg-[#FFD400]/15 group-active:bg-[#FFD400] group-active:text-black">
        {icon}
      </div>

      <span className="truncate text-[7px] font-bold text-[#A4A9AE] group-hover:text-[#F5F7F8]">
        {label}
      </span>
    </button>
  );
};
