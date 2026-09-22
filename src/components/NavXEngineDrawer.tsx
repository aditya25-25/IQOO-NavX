import React, { useState } from 'react';
import {
  X,
  Wifi,
  WifiOff,
  Radio,
  Cpu,
  RotateCcw,
  Zap,
  Layers,
  Mic,
  Activity,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { GPSQuality, PositionState, BatteryState } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface NavXEngineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isOffline: boolean;
  onToggleInternet: () => void;
  posState: PositionState;
  onSetGpsQuality: (quality: GPSQuality) => void;
  onSimulateMissedTurn: () => void;
  batteryState: BatteryState;
  onSetBatteryLevel: (level: number) => void;
  onToggleUltraMode: () => void;
  navProgress: NavigationProgress;
  onRunAutoDemoStep: (stepNumber: number) => void;
}

export const NavXEngineDrawer: React.FC<NavXEngineDrawerProps> = ({
  isOpen,
  onClose,
  isOffline,
  onToggleInternet,
  posState,
  onSetGpsQuality,
  onSimulateMissedTurn,
  batteryState,
  onSetBatteryLevel,
  onToggleUltraMode,
  navProgress,
  onRunAutoDemoStep,
}) => {
  const [activeTab, setActiveTab] = useState<'usp' | 'simulation'>('usp');
  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const uspFeatures = [
    {
      icon: Layers,
      color: 'text-[#FFD400]',
      iconBg: 'bg-[#FFD400]/10',
      title: 'Offline-First Navigation',
      description:
        'Zero-data graph routing using compressed local regional topology packages.',
      status: isOffline ? 'Offline Active' : 'Ready in Storage',
    },
    {
      icon: Activity,
      color: 'text-[#3B82F6]',
      iconBg: 'bg-[#3B82F6]/10',
      title: '6-DOF Sensor Fusion',
      description:
        'Fuses Accelerometer + Gyroscope + Compass when satellite reception drops.',
      status: posState.isSensorAssisted
        ? 'IMU Active'
        : 'GPS Synchronized',
    },
    {
      icon: RotateCcw,
      color: 'text-[#22C55E]',
      iconBg: 'bg-[#22C55E]/10',
      title: 'Instant Offline Rerouting',
      description:
        'Sub-50ms alternative path calculation without waiting for server response.',
      status:
        navProgress.status === 'rerouting'
          ? 'Recalculating...'
          : 'Local Solver Ready',
    },
    {
      icon: Mic,
      color: 'text-[#3B82F6]',
      iconBg: 'bg-[#3B82F6]/10',
      title: 'Natural AI Voice Guidance',
      description:
        'Hands-free speech commands parsed locally with offline text-to-speech.',
      status: 'Voice Engine Ready',
    },
    {
      icon: Zap,
      color: 'text-[#FFD400]',
      iconBg: 'bg-[#FFD400]/10',
      title: 'Ultra Navigation Mode',
      description:
        'OLED pitch-black high contrast UI for power preservation on long trips.',
      status: batteryState.isUltraMode
        ? 'Ultra Mode Active'
        : `${Math.round(batteryState.level * 100)}% Battery`,
    },
  ];

  const simulationSteps = [
    { step: 1, title: 'Boot & Splash', desc: 'System check & offline map verification' },
    { step: 2, title: 'Offline Regions', desc: 'View local regional packages' },
    { step: 3, title: 'Destination Select', desc: 'Pick College / Innovation Hub' },
    { step: 4, title: 'Calculate Route', desc: 'Compute local graph Dijkstra path' },
    { step: 5, title: 'Start Navigation', desc: 'Turn-by-turn guidance mode' },
    { step: 6, title: 'Internet Offline', desc: 'Simulate connection blackout' },
    { step: 9, title: 'GPS Lost / IMU', desc: 'Switch to 6-DOF sensor dead reckoning' },
    { step: 11, title: 'Missed Turn', desc: 'Instant local offline rerouting' },
    { step: 13, title: 'GPS Restored', desc: 'Satellite sync & track correction' },
    { step: 18, title: 'Ultra Navigation', desc: 'OLED power preservation' },
  ];

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/75
        flex items-end sm:items-center justify-center
        p-0 sm:p-4
        select-none
        animate-in fade-in duration-200
      "
    >
      <div
        className="
          w-full max-w-lg
          bg-[#111315]
          border border-[#2B2F33]
          sm:rounded-3xl rounded-t-3xl
          shadow-2xl
          overflow-hidden
          flex flex-col
          max-h-[92vh]
        "
      >
        {/* Mobile Handle */}
        <div className="sm:hidden flex justify-center pt-2">
          <div className="w-10 h-1 rounded-full bg-[#2B2F33]" />
        </div>

        {/* Header */}
        <header className="px-4 sm:px-5 py-4 border-b border-[#2B2F33]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  w-9 h-9 shrink-0
                  rounded-xl
                  bg-[#FFD400]
                  text-black
                  flex items-center justify-center
                "
              >
                <Sparkles size={17} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#FFD400]">
                    NavX Engine
                  </span>

                  <span
                    className={`
                      w-1.5 h-1.5 rounded-full
                      ${
                        isOffline
                          ? 'bg-[#F59E0B]'
                          : 'bg-[#22C55E]'
                      }
                    `}
                  />
                </div>

                <h3 className="text-sm font-black text-[#F5F7F8] font-display tracking-tight">
                  Technology & Simulation
                </h3>

                <p className="text-[10px] text-[#6F757B] mt-0.5">
                  Core systems and interactive testing
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close NavX Engine"
              className="
                w-9 h-9 shrink-0
                rounded-xl
                bg-[#191C1F]
                border border-[#2B2F33]
                flex items-center justify-center
                text-[#A4A9AE]
                hover:text-[#F5F7F8]
                hover:bg-[#22262A]
                active:scale-95
                transition-all
              "
            >
              <X size={17} />
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-3 py-2 border-b border-[#2B2F33] bg-[#08090A]">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#111315] border border-[#2B2F33]">
            <button
              onClick={() => setActiveTab('usp')}
              className={`
                py-2.5
                rounded-lg
                text-[10px]
                font-black
                uppercase
                tracking-wide
                transition-all
                active:scale-[0.98]
                ${
                  activeTab === 'usp'
                    ? 'bg-[#FFD400] text-black'
                    : 'text-[#A4A9AE] hover:text-[#F5F7F8]'
                }
              `}
            >
              Core Systems
            </button>

            <button
              onClick={() => setActiveTab('simulation')}
              className={`
                py-2.5
                rounded-lg
                text-[10px]
                font-black
                uppercase
                tracking-wide
                transition-all
                active:scale-[0.98]
                ${
                  activeTab === 'simulation'
                    ? 'bg-[#FFD400] text-black'
                    : 'text-[#A4A9AE] hover:text-[#F5F7F8]'
                }
              `}
            >
              Simulation
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">

          {/* CORE SYSTEMS */}
          {activeTab === 'usp' && (
            <div className="space-y-3">
              <div className="mb-4">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#FFD400]">
                  NavX Differentiators
                </p>
                <h4 className="text-base font-bold text-[#F5F7F8] mt-1">
                  Navigation built for resilience
                </h4>
              </div>

              {uspFeatures.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={index}
                    className="
                      p-3.5
                      rounded-2xl
                      bg-[#08090A]
                      border border-[#2B2F33]
                      hover:border-[#FFD400]/30
                      transition-all
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          w-9 h-9 shrink-0
                          rounded-xl
                          ${item.iconBg}
                          ${item.color}
                          flex items-center justify-center
                        `}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                          <h4 className="text-xs font-bold text-[#F5F7F8] font-display">
                            {item.title}
                          </h4>

                          <span
                            className="
                              self-start
                              text-[8px]
                              font-bold
                              font-mono
                              px-2 py-1
                              rounded-md
                              bg-[#191C1F]
                              text-[#A4A9AE]
                              border border-[#2B2F33]
                            "
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#A4A9AE] mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* SIMULATION */}
          {activeTab === 'simulation' && (
            <div className="space-y-3">

              {/* Simulation Header */}
              <div className="mb-4">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#FFD400]">
                  Demo Controls
                </p>
                <h4 className="text-base font-bold text-[#F5F7F8] mt-1">
                  Test NavX navigation states
                </h4>
                <p className="text-[10px] text-[#6F757B] mt-1">
                  Use these controls to demonstrate offline,
                  sensor and battery behavior.
                </p>
              </div>

              {/* Internet */}
              <section className="p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="
                      w-8 h-8 shrink-0
                      rounded-lg
                      bg-[#191C1F]
                      flex items-center justify-center
                    ">
                      {isOffline ? (
                        <WifiOff size={15} className="text-[#F59E0B]" />
                      ) : (
                        <Wifi size={15} className="text-[#22C55E]" />
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#F5F7F8] block">
                        Internet Connectivity
                      </span>
                      <span className="text-[9px] text-[#6F757B]">
                        Online vs local offline graph
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 p-1 rounded-lg bg-[#191C1F] shrink-0">
                    <button
                      onClick={() => {
                        if (isOffline) onToggleInternet();
                      }}
                      className={`
                        px-2.5 py-1.5
                        rounded-md
                        text-[9px]
                        font-black
                        transition-all
                        ${
                          !isOffline
                            ? 'bg-[#22C55E] text-black'
                            : 'text-[#6F757B]'
                        }
                      `}
                    >
                      ONLINE
                    </button>

                    <button
                      onClick={() => {
                        if (!isOffline) onToggleInternet();
                      }}
                      className={`
                        px-2.5 py-1.5
                        rounded-md
                        text-[9px]
                        font-black
                        transition-all
                        ${
                          isOffline
                            ? 'bg-[#F59E0B] text-black'
                            : 'text-[#6F757B]'
                        }
                      `}
                    >
                      OFFLINE
                    </button>
                  </div>
                </div>
              </section>

              {/* GPS */}
              <section className="p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="
                      w-8 h-8 shrink-0
                      rounded-lg
                      bg-[#191C1F]
                      flex items-center justify-center
                    ">
                      {posState.isSensorAssisted ? (
                        <Cpu size={15} className="text-[#3B82F6]" />
                      ) : (
                        <Radio size={15} className="text-[#22C55E]" />
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#F5F7F8] block">
                        GPS Satellite Status
                      </span>
                      <span className="text-[9px] text-[#6F757B]">
                        GPS ↔ 6-DOF sensor positioning
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 p-1 rounded-lg bg-[#191C1F] shrink-0">
                    <button
                      onClick={() => onSetGpsQuality('strong')}
                      className={`
                        px-2.5 py-1.5
                        rounded-md
                        text-[9px]
                        font-black
                        transition-all
                        ${
                          !posState.isSensorAssisted
                            ? 'bg-[#22C55E] text-black'
                            : 'text-[#6F757B]'
                        }
                      `}
                    >
                      NORMAL
                    </button>

                    <button
                      onClick={() => onSetGpsQuality('weak')}
                      className={`
                        px-2.5 py-1.5
                        rounded-md
                        text-[9px]
                        font-black
                        transition-all
                        ${
                          posState.isSensorAssisted
                            ? 'bg-[#3B82F6] text-white'
                            : 'text-[#6F757B]'
                        }
                      `}
                    >
                      LOST
                    </button>
                  </div>
                </div>
              </section>

              {/* Missed Turn */}
              <section className="p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="
                      w-8 h-8 shrink-0
                      rounded-lg
                      bg-[#F59E0B]/10
                      flex items-center justify-center
                      text-[#F59E0B]
                    ">
                      <RotateCcw size={15} />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#F5F7F8] block">
                        Simulate Missed Turn
                      </span>
                      <span className="text-[9px] text-[#6F757B]">
                        Trigger local rerouting
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onSimulateMissedTurn}
                    className="
                      px-3 py-2
                      rounded-lg
                      bg-[#F59E0B]
                      text-black
                      font-black
                      text-[9px]
                      tracking-wide
                      flex items-center gap-1.5
                      hover:bg-[#fbbf24]
                      active:scale-95
                      transition-all
                      shrink-0
                    "
                  >
                    <RotateCcw
                      size={12}
                      className={
                        navProgress.status === 'rerouting'
                          ? 'animate-spin'
                          : ''
                      }
                    />
                    TRIGGER
                  </button>
                </div>
              </section>

              {/* Ultra Mode */}
              <section className="p-3.5 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="
                      w-8 h-8 shrink-0
                      rounded-lg
                      bg-[#FFD400]/10
                      flex items-center justify-center
                      text-[#FFD400]
                    ">
                      <Zap size={15} />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#F5F7F8] block">
                        Ultra Navigation Mode
                      </span>
                      <span className="text-[9px] text-[#6F757B]">
                        OLED pitch-black power saver
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 p-1 rounded-lg bg-[#191C1F] shrink-0">
                    <button
                      onClick={() => {
                        if (batteryState.isUltraMode) onToggleUltraMode();
                      }}
                      className={`
                        px-2.5 py-1.5
                        rounded-md
                        text-[9px]
                        font-black
                        transition-all
                        ${
                          !batteryState.isUltraMode
                            ? 'bg-[#22262A] text-[#F5F7F8]'
                            : 'text-[#6F757B]'
                        }
                      `}
                    >
                      OFF
                    </button>

                    <button
                      onClick={() => {
                        if (!batteryState.isUltraMode) onToggleUltraMode();
                      }}
                      className={`
                        px-2.5 py-1.5
                        rounded-md
                        text-[9px]
                        font-black
                        transition-all
                        ${
                          batteryState.isUltraMode
                            ? 'bg-[#FFD400] text-black'
                            : 'text-[#6F757B]'
                        }
                      `}
                    >
                      ON
                    </button>
                  </div>
                </div>

                {/* Battery Slider */}
                <div className="mt-4 pt-3 border-t border-[#2B2F33]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-[#A4A9AE]">
                      Simulated Battery
                    </span>

                    <span className="text-[10px] font-bold font-mono text-[#F5F7F8]">
                      {Math.round(batteryState.level * 100)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={batteryState.level}
                    onChange={(e) =>
                      onSetBatteryLevel(parseFloat(e.target.value))
                    }
                    aria-label="Simulated battery level"
                    className="
                      w-full
                      accent-[#FFD400]
                      cursor-pointer
                    "
                  />
                </div>
              </section>

              {/* Automated Scenarios */}
              <section className="pt-3 mt-1 border-t border-[#2B2F33]">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#FFD400]">
                      Demo Flow
                    </p>
                    <h4 className="text-xs font-bold text-[#F5F7F8] mt-0.5">
                      Automated Scenarios
                    </h4>
                  </div>

                  <span className="text-[9px] text-[#6F757B]">
                    {simulationSteps.length} steps
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {simulationSteps.map((item) => {
                    const isActive = activeStep === item.step;

                    return (
                      <button
                        key={item.step}
                        onClick={() => {
                          setActiveStep(item.step);
                          onRunAutoDemoStep(item.step);
                        }}
                        className={`
                          p-2.5
                          rounded-xl
                          border
                          text-left
                          transition-all
                          active:scale-[0.98]
                          ${
                            isActive
                              ? 'bg-[#FFD400]/10 border-[#FFD400]/60'
                              : 'bg-[#08090A] border-[#2B2F33] hover:border-[#FFD400]/30'
                          }
                        `}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`
                              w-5 h-5 shrink-0
                              rounded-md
                              flex items-center justify-center
                              text-[8px]
                              font-black
                              ${
                                isActive
                                  ? 'bg-[#FFD400] text-black'
                                  : 'bg-[#191C1F] text-[#6F757B]'
                              }
                            `}
                          >
                            {item.step}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-[#F5F7F8] font-display">
                                {item.title}
                              </span>

                              <CheckCircle2
                                size={11}
                                className={
                                  isActive
                                    ? 'text-[#FFD400]'
                                    : 'text-[#2B2F33]'
                                }
                              />
                            </div>

                            <p className="text-[9px] text-[#6F757B] mt-0.5 line-clamp-1">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-4 py-3 border-t border-[#2B2F33] bg-[#191C1F]">
          <button
            onClick={onClose}
            className="
              w-full
              py-2.5
              rounded-xl
              bg-[#FFD400]
              hover:bg-[#ffe033]
              active:scale-[0.99]
              text-black
              font-black
              text-[10px]
              uppercase
              tracking-wide
              font-display
              transition-all
            "
          >
            Return to Map
          </button>
        </footer>
      </div>
    </div>
  );
};
