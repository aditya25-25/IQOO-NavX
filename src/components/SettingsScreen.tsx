```tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Cloud,
  CloudOff,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Volume2,
  VolumeX,
  Route,
  BatteryMedium,
  Download,
  Ruler,
  Info,
  Zap,
} from 'lucide-react';
import { BatteryState } from '../types';
import { User } from '@supabase/supabase-js';

interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  batteryState: BatteryState;
  onToggleUltraMode: (enable?: boolean) => void;
  isVoiceMuted: boolean;
  onToggleMute: () => void;
  currentUser?: User | null;
  onOpenAuth?: () => void;
  onUpdatePreferences?: (prefs: {
    voice_enabled?: boolean;
    dark_mode?: boolean;
  }) => void;
}

const Toggle: React.FC<{
  enabled: boolean;
  onClick: () => void;
  label: string;
}> = ({ enabled, onClick, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    onClick={onClick}
    className={`relative flex h-7 w-12 shrink-0 items-center rounded-full border p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD400]/50 active:scale-95 ${
      enabled
        ? 'border-[#FFD400] bg-[#FFD400]'
        : 'border-[#2B2F33] bg-[#22262A]'
    }`}
  >
    <span
      className={`h-5 w-5 rounded-full bg-black shadow-sm transition-transform duration-200 ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const SettingRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  divider?: boolean;
}> = ({ icon, title, description, children, divider = false }) => (
  <div
    className={`flex items-center justify-between gap-4 py-3.5 ${
      divider ? 'border-b border-[#2B2F33]' : ''
    }`}
  >
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#191C1F] text-[#A4A9AE]">
        {icon}
      </div>

      <div className="min-w-0">
        <span className="block text-sm font-semibold text-[#F5F7F8]">
          {title}
        </span>
        <span className="mt-0.5 block text-[11px] leading-4 text-[#A4A9AE]">
          {description}
        </span>
      </div>
    </div>

    <div className="shrink-0">{children}</div>
  </div>
);

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="overflow-hidden rounded-3xl border border-[#2B2F33] bg-[#111315]">
    <div className="flex items-center gap-2 border-b border-[#2B2F33] px-4 py-3">
      <span className="text-[#FFD400]">{icon}</span>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#F5F7F8]">
        {title}
      </h2>
    </div>

    <div className="px-4">{children}</div>
  </section>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isOpen,
  onClose,
  batteryState,
  onToggleUltraMode,
  isVoiceMuted,
  onToggleMute,
  currentUser = null,
  onOpenAuth,
  onUpdatePreferences,
}) => {
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [useOfflineMaps, setUseOfflineMaps] = useState(true);
  const [units, setUnits] = useState<'km' | 'mi'>('km');

  if (!isOpen) return null;

  const handleVoiceToggle = () => {
    onToggleMute();

    if (onUpdatePreferences) {
      onUpdatePreferences({
        voice_enabled: isVoiceMuted,
      });
    }
  };

  const batteryPercent = Math.round(batteryState.level * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#08090A] text-[#F5F7F8]">
      {/* Header */}
      <header className="shrink-0 border-b border-[#2B2F33] bg-[#08090A]/95 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2B2F33] bg-[#191C1F] text-[#A4A9AE] transition-all hover:bg-[#22262A] hover:text-[#F5F7F8] focus:outline-none focus:ring-2 focus:ring-[#FFD400]/50 active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-[#F5F7F8]">
                  Settings
                </h1>
                <span className="rounded-md bg-[#FFD400] px-1.5 py-0.5 text-[8px] font-black tracking-wider text-black">
                  NAVX
                </span>
              </div>

              <p className="mt-0.5 text-[10px] text-[#6F757B]">
                Navigation preferences
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center gap-1.5 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/10 px-2.5 py-1.5 text-[10px] font-semibold text-[#22C55E]">
              <Cloud size={12} />
              Synced
            </div>
          )}
        </div>
      </header>

      {/* Settings Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-[max(24px,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-2xl space-y-3">
          {/* Account */}
          <Section
            title="Cloud & Account"
            icon={<Cloud size={14} />}
          >
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex w-full items-center justify-between gap-3 py-4 text-left focus:outline-none"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                    currentUser
                      ? 'border-[#22C55E]/25 bg-[#22C55E]/10 text-[#22C55E]'
                      : 'border-[#FFD400]/20 bg-[#FFD400]/10 text-[#FFD400]'
                  }`}
                >
                  {currentUser ? (
                    <UserIcon size={18} />
                  ) : (
                    <CloudOff size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#F5F7F8]">
                    {currentUser ? currentUser.email : 'Local Guest Mode'}
                  </span>

                  <span className="mt-1 flex items-center gap-1 text-[11px] text-[#A4A9AE]">
                    {currentUser ? (
                      <>
                        <ShieldCheck size={12} className="text-[#22C55E]" />
                        <span className="text-[#22C55E]">
                          Cloud synced with RLS
                        </span>
                      </>
                    ) : (
                      'Sign in to sync saved places'
                    )}
                  </span>
                </div>
              </div>

              <ChevronRight
                size={17}
                className="shrink-0 text-[#6F757B] transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </Section>

          {/* Navigation */}
          <Section
            title="Navigation & Voice"
            icon={<Route size={14} />}
          >
            <SettingRow
              icon={
                isVoiceMuted ? (
                  <VolumeX size={17} />
                ) : (
                  <Volume2 size={17} />
                )
              }
              title="Voice Guidance"
              description="Spoken turn-by-turn prompts"
              divider
            >
              <Toggle
                enabled={!isVoiceMuted}
                onClick={handleVoiceToggle}
                label="Toggle voice guidance"
              />
            </SettingRow>

            <SettingRow
              icon={<Route size={17} />}
              title="Avoid Toll Roads"
              description="Prefer routes without tolls"
            >
              <Toggle
                enabled={avoidTolls}
                onClick={() => setAvoidTolls(!avoidTolls)}
                label="Toggle avoid toll roads"
              />
            </SettingRow>
          </Section>

          {/* Power */}
          <Section
            title="Battery & Ultra Navigation"
            icon={<Zap size={14} />}
          >
            <SettingRow
              icon={<Zap size={17} />}
              title="Ultra Navigation Mode"
              description="Minimal HUD for reduced power use"
              divider
            >
              <Toggle
                enabled={batteryState.isUltraMode}
                onClick={() => onToggleUltraMode()}
                label="Toggle Ultra Navigation Mode"
              />
            </SettingRow>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#191C1F] text-[#A4A9AE]">
                  <BatteryMedium size={17} />
                </div>

                <div>
                  <span className="block text-sm font-semibold text-[#F5F7F8]">
                    Battery Level
                  </span>
                  <span className="text-[11px] text-[#A4A9AE]">
                    Current device estimate
                  </span>
                </div>
              </div>

              <span
                className={`font-mono text-sm font-bold ${
                  batteryState.isLowBattery
                    ? 'text-[#EF4444]'
                    : batteryPercent <= 30
                      ? 'text-[#F59E0B]'
                      : 'text-[#22C55E]'
                }`}
              >
                {batteryPercent}%
              </span>
            </div>
          </Section>

          {/* Offline */}
          <Section
            title="Offline Maps & Units"
            icon={<Download size={14} />}
          >
            <SettingRow
              icon={<Download size={17} />}
              title="Offline Map Engine"
              description="Prioritize downloaded map data"
              divider
            >
              <Toggle
                enabled={useOfflineMaps}
                onClick={() => setUseOfflineMaps(!useOfflineMaps)}
                label="Toggle offline map engine"
              />
            </SettingRow>

            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#191C1F] text-[#A4A9AE]">
                  <Ruler size={17} />
                </div>

                <div>
                  <span className="block text-sm font-semibold text-[#F5F7F8]">
                    Distance Units
                  </span>
                  <span className="text-[11px] text-[#A4A9AE]">
                    Choose km or miles
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 rounded-xl border border-[#2B2F33] bg-[#191C1F] p-1">
                <button
                  type="button"
                  onClick={() => setUnits('km')}
                  aria-pressed={units === 'km'}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                    units === 'km'
                      ? 'bg-[#FFD400] text-black'
                      : 'text-[#A4A9AE] hover:text-[#F5F7F8]'
                  }`}
                >
                  km
                </button>

                <button
                  type="button"
                  onClick={() => setUnits('mi')}
                  aria-pressed={units === 'mi'}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                    units === 'mi'
                      ? 'bg-[#FFD400] text-black'
                      : 'text-[#A4A9AE] hover:text-[#F5F7F8]'
                  }`}
                >
                  mi
                </button>
              </div>
            </div>
          </Section>

          {/* About */}
          <Section
            title="About NavX"
            icon={<Info size={14} />}
          >
            <div className="space-y-3 py-4 text-[11px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#A4A9AE]">Application Version</span>
                <span className="font-mono font-semibold text-[#F5F7F8]">
                  1.0.0
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-[#A4A9AE]">Tagline</span>
                <span className="max-w-[220px] text-right font-medium italic text-[#FFD400]">
                  Navigate. Even When It's Not Perfect.
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#A4A9AE]">Platform</span>
                <span className="text-right font-semibold text-[#F5F7F8]">
                  iQOO Smartphone First
                </span>
              </div>
            </div>
          </Section>

          {/* Footer Brand */}
          <div className="px-2 pt-2 text-center">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-[#6F757B]">
              <span className="text-[#A4A9AE]">iQOO</span>{' '}
              <span className="text-[#FFD400]">NAVX</span>
            </div>
            <p className="mt-1 text-[9px] text-[#4F5459]">
              Offline-first navigation engine
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
```
