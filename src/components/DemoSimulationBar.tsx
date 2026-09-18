import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  Cpu, 
  RotateCcw, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { GPSQuality, PositionState, BatteryState } from '../types';
import { NavigationProgress } from '../engine/navigationController';

interface DemoSimulationBarProps {
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

export const DemoSimulationBar: React.FC<DemoSimulationBarProps> = ({
  isOffline,
  onToggleInternet,
  posState,
  onSetGpsQuality,
  onSimulateMissedTurn,
  batteryState,
  onSetBatteryLevel,
  onToggleUltraMode,
  navProgress,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeDemoStep, setActiveDemoStep] = useState<number | null>(null);

  const demoStepsList = [
    { step: 1, title: 'Open IQOO NavX', desc: 'Initialize dark theme & UI shell' },
    { step: 2, title: 'Download Region', desc: 'Verify local regional map package' },
    { step: 3, title: 'Select Destination', desc: 'Pick College / Innovation Hub' },
    { step: 4, title: 'Calculate Route', desc: 'Solve offline graph route & context' },
    { step: 5, title: 'Start Navigation', desc: 'Begin turn-by-turn guidance' },
    { step: 6, title: 'Disable Internet', desc: 'Simulate connection loss' },
    { step: 7, title: 'Show Offline Mode', desc: 'Seamless offline continuation' },
    { step: 9, title: 'Simulate Weak GPS', desc: 'Trigger sensor dead reckoning' },
    { step: 11, title: 'Simulate Missed Turn', desc: 'Trigger offline rerouting solver' },
    { step: 13, title: 'Restore GPS', desc: 'Smooth position correction' },
    { step: 15, title: 'AI Command Parser', desc: 'Natural-language voice input' },
    { step: 17, title: 'Origin Island HUD', desc: 'Live dynamic notification card' },
    { step: 18, title: 'Low Battery / Ultra Mode', desc: 'OLED power conservation' }
  ];

  return (
    <div className="w-full z-40 select-none px-4 pb-2">
      {/* Simulation Master Pill */}
      <div className="p-2.5 rounded-2xl bg-[#0e111a]/95 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-[#ff4800]" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-display">
              Hackathon Demo / Simulation Controls
            </span>
          </div>

          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#ff4800] hover:text-[#ff6b2b] px-2 py-1 rounded-lg bg-[#ff4800]/10"
          >
            <span>{isPanelOpen ? 'Collapse Controls' : 'Expand Demo Suite'}</span>
            {isPanelOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Quick Simulation Action Buttons */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 font-sans">
          {/* Internet Toggle */}
          <button
            onClick={onToggleInternet}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold transition-all ${
              isOffline
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
            <span>{isOffline ? 'Offline' : 'Online'}</span>
          </button>

          {/* GPS Quality Toggle */}
          <button
            onClick={() => {
              if (posState.gpsQuality === 'strong') {
                onSetGpsQuality('weak');
              } else {
                onSetGpsQuality('strong');
              }
            }}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold transition-all ${
              posState.isSensorAssisted
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}
          >
            {posState.isSensorAssisted ? <Cpu size={14} /> : <Radio size={14} />}
            <span>{posState.isSensorAssisted ? 'IMU Mode' : 'GPS Fix'}</span>
          </button>

          {/* Missed Turn / Offline Reroute Trigger */}
          <button
            onClick={onSimulateMissedTurn}
            disabled={navProgress.status !== 'navigating'}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw size={14} className={navProgress.status === 'rerouting' ? 'animate-spin' : ''} />
            <span>Missed Turn</span>
          </button>

          {/* Ultra Navigation Mode Toggle */}
          <button
            onClick={onToggleUltraMode}
            className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold transition-all ${
              batteryState.isUltraMode
                ? 'bg-[#ff4800] text-black font-bold'
                : 'bg-[#ff4800]/20 text-[#ff4800] border border-[#ff4800]/40'
            }`}
          >
            <Zap size={14} />
            <span>{batteryState.isUltraMode ? 'Ultra ON' : 'Ultra Mode'}</span>
          </button>
        </div>

        {/* Detailed Expandable Panel for Judges & Scenario Walkthrough */}
        {isPanelOpen && (
          <div className="pt-2 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
            {/* Battery Level Slider */}
            <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                <span>Simulate Battery:</span>
                <span className={`font-bold ${batteryState.isLowBattery ? 'text-red-400' : 'text-neutral-200'}`}>
                  {Math.round(batteryState.level * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={batteryState.level}
                onChange={(e) => onSetBatteryLevel(parseFloat(e.target.value))}
                className="w-36 accent-[#ff4800] cursor-pointer"
              />
            </div>

            {/* Step-by-Step Hackathon Demo Scenario Guide */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 font-display">
                <Sparkles size={13} className="text-[#ff4800]" />
                <span>Judging Scenario Checklist (Steps 1 to 20):</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {demoStepsList.map((item) => (
                  <div
                    key={item.step}
                    onClick={() => setActiveDemoStep(item.step)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      activeDemoStep === item.step
                        ? 'bg-[#ff4800]/15 border-[#ff4800] text-white'
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-200">
                        Step {item.step}: {item.title}
                      </span>
                      <CheckCircle2 size={12} className={activeDemoStep === item.step ? 'text-[#ff4800]' : 'text-neutral-600'} />
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
