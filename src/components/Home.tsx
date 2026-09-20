```tsx
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

interface HomeProps {
  onSearch?: () => void;
  onVoice?: () => void;
  onStartNavigation?: () => void;
  onSaved?: () => void;
  onSettings?: () => void;
  onRecenter?: () => void;
  onAddLocation?: () => void;
}

const Home: React.FC<HomeProps> = ({
  onSearch,
  onVoice,
  onStartNavigation,
  onSaved,
  onSettings,
  onRecenter,
  onAddLocation,
}) => {
  return (
    <main className="min-h-screen w-full bg-[#050706] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#080b0a]">

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

                <span className="text-gray-400">
                  Offline Ready
                </span>
              </div>
            </div>

            {/* Battery + More */}
            <div className="flex items-center gap-2">

              <div className="flex items-center gap-2 rounded-full border border-lime-400/30 bg-[#111713] px-3.5 py-2">
                <BatteryMedium
                  size={17}
                  className="text-lime-400"
                />

                <span className="text-xs font-medium text-gray-200">
                  82%
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
            SEARCH BAR
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
            MAP
            Replace temporary visual layer with existing MapView
        ===================================================== */}
        <section className="relative mx-5 mt-5 h-[390px] overflow-hidden rounded-[28px] border border-white/10 bg-[#10191d]">

          {/* Temporary Map Background */}
          <div className="absolute inset-0 overflow-hidden">

            {/* Dark map grid */}
            <div className="absolute inset-0 opacity-60">

              {/* Roads */}
              <div className="absolute left-[8%] top-[-20%] h-[150%] w-[3px] rotate-[25deg] bg-slate-500/25" />

              <div className="absolute left-[24%] top-[-20%] h-[150%] w-[2px] rotate-[-15deg] bg-slate-500/20" />

              <div className="absolute left-[48%] top-[-30%] h-[170%] w-[4px] rotate-[53deg] bg-slate-500/25" />

              <div className="absolute left-[70%] top-[-20%] h-[150%] w-[3px] rotate-[-25deg] bg-slate-500/25" />

              <div className="absolute left-[88%] top-[-20%] h-[150%] w-[2px] rotate-[18deg] bg-slate-500/20" />

              <div className="absolute left-[-20%] top-[25%] h-[3px] w-[150%] rotate-[8deg] bg-slate-500/25" />

              <div className="absolute left-[-20%] top-[47%] h-[4px] w-[150%] rotate-[-10deg] bg-slate-500/25" />

              <div className="absolute left-[-20%] top-[70%] h-[2px] w-[150%] rotate-[18deg] bg-slate-500/20" />

              <div className="absolute left-[-20%] top-[87%] h-[3px] w-[150%] rotate-[-8deg] bg-slate-500/20" />

              {/* District blocks */}
              <div className="absolute left-5 top-24 h-20 w-28 rounded-2xl bg-emerald-400/[0.06]" />

              <div className="absolute right-5 top-20 h-28 w-32 rounded-2xl bg-emerald-400/[0.05]" />

              <div className="absolute bottom-20 left-12 h-20 w-28 rounded-2xl bg-emerald-400/[0.05]" />

              <div className="absolute bottom-12 right-10 h-28 w-32 rounded-2xl bg-emerald-400/[0.05]" />

              {/* River */}
              <div className="absolute -left-20 top-[58%] h-12 w-[140%] rotate-[18deg] rounded-full bg-blue-500/20 blur-[2px]" />

            </div>

            {/* Map Labels */}
            <div className="absolute left-[15%] top-[36%] text-[11px] text-gray-400">
              <span className="mr-1">♟</span>
              Riverside Park
            </div>

            <div className="absolute right-[18%] top-[42%] text-[13px] leading-tight text-gray-400">
              Central
              <br />
              District
            </div>

            <div className="absolute bottom-[18%] right-[22%] text-[11px] text-gray-500">
              Tech Park
            </div>

            {/* Route */}
            <div className="absolute left-[39%] top-[61%] h-[180px] w-[6px] origin-top rotate-[18deg] rounded-full bg-lime-400 shadow-[0_0_15px_rgba(163,255,18,0.55)]" />

            <div className="absolute left-[37%] top-[58%] h-16 w-16 rounded-full bg-lime-400/10 blur-md" />
          </div>

          {/* Map Status */}
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">

            <div className="rounded-full border border-white/20 bg-black/50 px-4 py-2 backdrop-blur-md">
              <span className="text-[11px] font-semibold tracking-wide text-white">
                OFFLINE MAP
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-lime-400/50 bg-black/50 px-4 py-2 backdrop-blur-md">
              <Wifi
                size={13}
                className="text-lime-400"
              />

              <span className="text-[11px] font-medium text-lime-300">
                Sensor Assisted
              </span>
            </div>

          </div>

          {/* Current Position */}
          <div className="absolute left-[50%] top-[52%] -translate-x-1/2 -translate-y-1/2">

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

          {/* Zoom Controls */}
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
                <MapPin
                  size={20}
                  className="text-lime-400"
                />
              </div>

              <div>
                <p className="text-[10px] text-gray-400">
                  Current location
                </p>

                <p className="mt-0.5 text-xs font-semibold text-white">
                  Location detected
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
              className="flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-[22px] border border-lime-400/20 bg-[#0d1913] p-4 transition hover:border-lime-400/40 hover:bg-[#102017]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/10">
                <HomeIcon
                  size={24}
                  className="text-lime-400"
                />
              </div>

              <span className="text-[16px] font-semibold text-white">
                Home
              </span>
            </button>

            {/* COLLEGE */}
            <button
              type="button"
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
            </button>

            {/* ADD */}
            <button
              type="button"
              onClick={onAddLocation}
              className="flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-[22px] border border-dashed border-white/20 bg-[#0a1113] p-4 transition hover:border-lime-400/30 hover:bg-[#0d1713]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#162126]">
                <Plus
                  size={25}
                  className="text-gray-400"
                />
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
                  Select a destination first
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
```
