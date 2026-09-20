import React from "react";
import {
  Search,
  Mic,
  BatteryMedium,
  MoreVertical,
  MapPin,
  Navigation,
  Home as HomeIcon,
  GraduationCap,
  Plus,
  Star,
  Settings,
  LocateFixed,
  Minus,
  Wifi,
} from "lucide-react";

import { BatteryState, MapRegion, POI, PositionState } from "../types";
import { MapView } from "./MapView";
import { NavigationProgress } from "../engine/navigationController";

interface HomeProps {
  activeRegion: MapRegion;
  savedLocations: POI[];
  posState: PositionState;
  batteryState: BatteryState;
  navProgress: NavigationProgress;
  isOffline: boolean;

  onSearch?: () => void;
  onVoice?: () => void;
  onStartNavigation?: () => void;
  onSaved?: () => void;
  onSettings?: () => void;
  onRecenter?: () => void;
  onAddLocation?: () => void;

  onSelectDestination?: (poi: POI) => void;
}

const Home: React.FC<HomeProps> = ({
  activeRegion,
  savedLocations,
  posState,
  batteryState,
  navProgress,
  isOffline,

  onSearch,
  onVoice,
  onStartNavigation,
  onSaved,
  onSettings,
  onRecenter,
  onAddLocation,
  onSelectDestination,
}) => {
  /*
   * ============================================================
   * REAL NAVX DATA
   * ============================================================
   */

  const batteryPercent = Math.max(
    0,
    Math.min(100, Math.round(batteryState.level * 100))
  );

  const currentPosition = posState.currentPosition;

  /*
   * Try to find actual Home / College POIs from the active region.
   * Falls back to saved locations if necessary.
   */
  const homePoi =
    activeRegion.pois.find(
      (poi) =>
        poi.category?.toLowerCase() === "home" ||
        poi.name?.toLowerCase() === "home"
    ) ??
    savedLocations.find(
      (poi) =>
        poi.category?.toLowerCase() === "home" ||
        poi.name?.toLowerCase() === "home"
    );

  const collegePoi =
    activeRegion.pois.find(
      (poi) =>
        poi.category?.toLowerCase() === "college" ||
        poi.name?.toLowerCase() === "college"
    ) ??
    savedLocations.find(
      (poi) =>
        poi.category?.toLowerCase() === "college" ||
        poi.name?.toLowerCase() === "college"
    );

  const hasDestination = Boolean(navProgress.activeRoute);

  /*
   * ============================================================
   * DESTINATION SELECTION
   * ============================================================
   */

  const selectDestination = (poi?: POI) => {
    if (!poi) {
      onAddLocation?.();
      return;
    }

    onSelectDestination?.(poi);
  };

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-[#050706] text-white">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-[#080b0a]">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="px-5 pb-3 pt-5">
          <div className="flex items-start justify-between">
            {/* Logo + Status */}
            <div>
              <h1 className="text-[30px] font-extrabold tracking-[-1.5px]">
                NAV
                <span className="text-lime-400">X</span>
              </h1>

              <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,255,18,0.9)]" />
                  GPS Active
                </span>

                <span className="text-gray-700">•</span>

                <span
                  className={
                    isOffline
                      ? "text-lime-300"
                      : "text-gray-400"
                  }
                >
                  {isOffline ? "Offline Ready" : "Online"}
                </span>
              </div>
            </div>

            {/* Battery + More */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-lime-400/30 bg-[#111713] px-3.5 py-2">
                <BatteryMedium
                  size={17}
                  className={
                    batteryPercent <= 20
                      ? "text-red-400"
                      : "text-lime-400"
                  }
                />

                <span className="text-xs font-medium text-gray-200">
                  {batteryPercent}%
                </span>
              </div>

              <button
                type="button"
                aria-label="More options"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#11181a] text-gray-300 transition hover:bg-[#17201c] hover:text-white"
              >
                <MoreVertical size={19} />
              </button>
            </div>
          </div>
        </header>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <section className="px-5 pt-2">
          <button
            type="button"
            onClick={onSearch}
            className="group flex w-full items-center gap-4 rounded-[28px] border border-white/10 bg-[#11191d] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition hover:border-lime-400/30"
          >
            <Search
              size={25}
              className="shrink-0 text-gray-300 transition group-hover:text-lime-400"
            />

            <span className="flex-1 text-left text-[17px] text-gray-300">
              Where do you want to go?
            </span>

            <span
              role="button"
              tabIndex={0}
              aria-label="Voice search"
              onClick={(event) => {
                event.stopPropagation();
                onVoice?.();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onVoice?.();
                }
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-lime-400 transition hover:bg-lime-400/25"
            >
              <Mic size={21} />
            </span>
          </button>
        </section>

        {/* =====================================================
            REAL MAP
        ===================================================== */}

        <section className="relative mx-5 mt-5 h-[390px] overflow-hidden rounded-[28px] border border-white/10 bg-[#10191d]">
          <MapView
            currentPosition={currentPosition}
            positionState={posState}
            activeRoute={navProgress.activeRoute}
            activeRegion={activeRegion}
            savedLocations={savedLocations}
            isUltraMode={batteryState.isUltraMode}
            onSelectPOI={(poi) => {
              onSelectDestination?.(poi);
            }}
          />

          {/* Map status overlay */}
          <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-center justify-between">
            <div className="rounded-full border border-white/20 bg-black/60 px-4 py-2 backdrop-blur-md">
              <span className="text-[11px] font-semibold tracking-wide text-white">
                {isOffline ? "OFFLINE MAP" : "MAP READY"}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-lime-400/50 bg-black/60 px-4 py-2 backdrop-blur-md">
              <Wifi size={13} className="text-lime-400" />

              <span className="text-[11px] font-medium text-lime-300">
                Sensor Assisted
              </span>
            </div>
          </div>

          {/* Current position indicator */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute -inset-12 rounded-full bg-lime-400/[0.05]" />

            <div className="absolute -inset-7 rounded-full bg-lime-400/[0.08]" />

            <div className="absolute -inset-3 rounded-full border border-lime-400/20 bg-lime-400/10" />

            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-lime-400 bg-[#d8ff9a] shadow-[0_0_25px_rgba(163,255,18,0.85)]">
              <div className="h-3 w-3 rounded-full bg-lime-600" />
            </div>
          </div>

          {/* Recenter */}
          <button
            type="button"
            onClick={onRecenter}
            aria-label="Recenter map"
            className="absolute bottom-20 right-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
          >
            <LocateFixed size={20} />
          </button>

          {/* Zoom controls - visual controls */}
          <div className="absolute bottom-4 right-4 overflow-hidden rounded-2xl border border-white/20 bg-black/60 backdrop-blur-md">
            <button
              type="button"
              aria-label="Zoom in"
              className="flex h-11 w-11 items-center justify-center border-b border-white/10 text-2xl text-white transition hover:bg-white/5"
            >
              +
            </button>

            <button
              type="button"
              aria-label="Zoom out"
              className="flex h-11 w-11 items-center justify-center text-white transition hover:bg-white/5"
            >
              <Minus size={19} />
            </button>
          </div>

          {/* Current Location */}
          <div className="absolute bottom-4 left-4 rounded-2xl border border-white/10 bg-black/70 px-3.5 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/10">
                <MapPin size={20} className="text-lime-400" />
              </div>

              <div>
                <p className="text-[10px] text-gray-400">
                  Current location
                </p>

                <p className="mt-0.5 text-xs font-semibold text-white">
                  {currentPosition
                    ? "Location detected"
                    : "Detecting location..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK DESTINATIONS
        ===================================================== */}

        <section className="px-5 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-white">
              Quick destinations
            </h2>

            <button
              type="button"
              onClick={onSaved}
              className="flex items-center gap-2 text-sm font-semibold text-lime-400 transition hover:text-lime-300"
            >
              Manage
              <span className="text-lg">›</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* HOME */}
            <button
              type="button"
              onClick={() => selectDestination(homePoi)}
              className="flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-[22px] border border-lime-400/20 bg-[#0d1913] p-4 transition hover:border-lime-400/40 hover:bg-[#102017]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/10">
                <HomeIcon size={24} className="text-lime-400" />
              </div>

              <span className="text-[16px] font-semibold text-white">
                Home
              </span>

              {!homePoi && (
                <span className="text-center text-[9px] text-gray-500">
                  Not saved
                </span>
              )}
            </button>

            {/* COLLEGE */}
            <button
              type="button"
              onClick={() => selectDestination(collegePoi)}
              className="flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-[22px] border border-lime-400/20 bg-[#0d1913] p-4 transition hover:border-lime-400/40 hover:bg-[#102017]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/10">
                <GraduationCap
                  size={24}
                  className="text-lime-400"
                />
              </div>

              <span className="text-[16px] font-semibold text-white">
                College
              </span>

              {!collegePoi && (
                <span className="text-center text-[9px] text-gray-500">
                  Not saved
                </span>
              )}
            </button>

            {/* ADD */}
            <button
              type="button"
              onClick={onAddLocation}
              className="flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-[22px] border border-dashed border-white/20 bg-[#0a1113] p-4 transition hover:border-lime-400/30 hover:bg-[#0d1713]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#162126]">
                <Plus size={25} className="text-gray-400" />
              </div>

              <span className="text-[16px] font-medium text-gray-400">
                Add
              </span>
            </button>
          </div>
        </section>

        {/* =====================================================
            START NAVIGATION
        ===================================================== */}

        <section className="px-5 pt-5">
          <button
            type="button"
            onClick={onStartNavigation}
            className="group flex w-full items-center justify-between rounded-[24px] bg-lime-400 px-5 py-5 text-black shadow-[0_0_35px_rgba(163,255,18,0.18)] transition hover:bg-lime-300 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
                <Navigation
                  size={22}
                  className="fill-lime-400 text-lime-400"
                />
              </div>

              <div className="text-left">
                <p className="text-[19px] font-extrabold">
                  Start Navigation
                </p>

                <p className="mt-0.5 text-xs font-medium opacity-70">
                  {hasDestination
                    ? "Ready to navigate"
                    : "Select a destination first"}
                </p>
              </div>
            </div>

            <span className="text-3xl transition group-hover:translate-x-1">
              →
            </span>
          </button>
        </section>

        {/* =====================================================
            BOTTOM NAVIGATION
        ===================================================== */}

        <nav className="mt-7 flex items-center justify-around border-t border-white/10 bg-[#080b0a] px-5 pb-6 pt-5">
          {/* MAP */}
          <button
            type="button"
            className="flex min-w-[70px] flex-col items-center gap-2 text-lime-400"
          >
            <Navigation
              size={23}
              className="fill-lime-400"
            />

            <span className="text-xs font-semibold">
              Map
            </span>

            <span className="h-0.5 w-12 rounded-full bg-lime-400" />
          </button>

          {/* SAVED */}
          <button
            type="button"
            onClick={onSaved}
            className="flex min-w-[70px] flex-col items-center gap-2 text-gray-500 transition hover:text-white"
          >
            <Star size={23} />

            <span className="text-xs">
              Saved
            </span>

            <span className="h-0.5 w-12 rounded-full bg-transparent" />
          </button>

          {/* SETTINGS */}
          <button
            type="button"
            onClick={onSettings}
            className="flex min-w-[70px] flex-col items-center gap-2 text-gray-500 transition hover:text-white"
          >
            <Settings size={23} />

            <span className="text-xs">
              Settings
            </span>

            <span className="h-0.5 w-12 rounded-full bg-transparent" />
          </button>
        </nav>
      </div>
    </main>
  );
};

export default Home;
