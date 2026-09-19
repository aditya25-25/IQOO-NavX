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
    { step: 1, title: 'Splash / Launch', desc: 'App boot & offline check' },
    { step: 2, title: 'Download Region', desc: 'Verify local regional map package' },
    { step: 3, title: 'Select Destination', desc: 'Pick College / Innovation Hub' },
    { step: 4, title: 'Calculate Route', desc: 'Solve offline graph route & context' },
    { step: 5, title: 'Start Navigation', desc: 'Begin turn-by-turn guidance' },
    { step: 6, title: 'Disable Internet', desc: 'Simulate connection loss' },
    { step: 7, title: 'Offline Nav State', desc: 'Seamless offline continuation' },
    { step: 9, title: 'Simulate Weak GPS', desc: 'Trigger sensor dead reckoning' },
    { step: 11, title: 'Missed Turn', desc: 'Trigger offline rerouting solver' },
    { step: 13, title: 'Restore GPS', desc: 'Position corrected smoothly' },
    { step: 15, title: 'Voice AI Commands', desc: 'Hands-free speech commands' },
    { step: 17, title: 'Origin Island HUD', desc: 'Live dynamic notification card' },
    { step: 18, title: 'Low Battery / Ultra Mode', desc: 'OLED power conservation' }
  ];

  return (
    <div className="w-full z-40 select-none px-4 pb-2">
      {/* Simulation Master Pill */}
      <div className="p-2.5 rounded-2xl bg-[#111315]/95 backdrop-blur-xl border border-[#2B2F33] shadow-2xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-[#FFD400]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F7F8] font-display">
              Hackathon Demo / Simulation Controls
            </span>
          </div>

          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#FFD400] hover:underline px-2 py-1 rounded-lg bg-[#FFD400]/10 font-display"
          >
            <span>{isPanelOpen ? 'Collapse Controls' : 'Expand Demo Suite'}</span>
            {isPanelOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Quick Simulation Action Buttons */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 font-display">
          {/* Internet Toggle */}
          <button
            onClick={onToggleInternet}
            className={`flex items-center justify-center gap-1 p-2 rounded-xl text-xs font-bold transition-all ${
              isOffline
                ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
            }`}
          >
            {isOffline ? <WifiOff size={13} /> : <Wifi size={13} />}
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
            className={`flex items-center justify-center gap-1 p-2 rounded-xl text-xs font-bold transition-all ${
              posState.isSensorAssisted
                ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40'
                : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
            }`}
          >
            {posState.isSensorAssisted ? <Cpu size={13} /> : <Radio size={13} />}
            <span>{posState.isSensorAssisted ? 'IMU Mode' : 'GPS OK'}</span>
          </button>

          {/* Missed Turn / Offline Reroute Trigger */}
          <button
            onClick={onSimulateMissedTurn}
            disabled={navProgress.status !== 'navigating'}
            className="flex items-center justify-center gap-1 p-2 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw size={13} className={navProgress.status === 'rerouting' ? 'animate-spin' : ''} />
            <span>Missed Turn</span>
          </button>

          {/* Ultra Navigation Mode Toggle */}
          <button
            onClick={onToggleUltraMode}
            className={`flex items-center justify-center gap-1 p-2 rounded-xl text-xs font-bold transition-all ${
              batteryState.isUltraMode
                ? 'bg-[#FFD400] text-black font-extrabold'
                : 'bg-[#FFD400]/20 text-[#FFD400] border border-[#FFD400]/40'
            }`}
          >
            <Zap size={13} />
            <span>{batteryState.isUltraMode ? 'Ultra ON' : 'Ultra Mode'}</span>
          </button>
        </div>

        {/* Detailed Expandable Panel for Judges & Scenario Walkthrough */}
        {isPanelOpen && (
          <div className="pt-2 border-t border-[#2B2F33] space-y-3 animate-in fade-in duration-200">
            {/* Battery Level Slider */}
            <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
              <div className="flex items-center gap-2 text-xs text-[#F5F7F8] font-medium font-display">
                <span>Simulate Battery:</span>
                <span className={`font-bold ${batteryState.isLowBattery ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
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
                className="w-36 accent-[#FFD400] cursor-pointer"
              />
            </div>

            {/* Step-by-Step Hackathon Demo Scenario Guide */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A4A9AE] font-display">
                <Sparkles size={13} className="text-[#FFD400]" />
                <span>Judging Scenario Walkthrough (Steps 1 to 20):</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1 font-display">
                {demoStepsList.map((item) => (
                  <div
                    key={item.step}
                    onClick={() => setActiveDemoStep(item.step)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      activeDemoStep === item.step
                        ? 'bg-[#FFD400]/15 border-[#FFD400] text-[#F5F7F8]'
                        : 'bg-[#191C1F] border-[#2B2F33] hover:border-[#FFD400]/40 text-[#A4A9AE]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#F5F7F8]">
                        Step {item.step}: {item.title}
                      </span>
                      <CheckCircle2 size={12} className={activeDemoStep === item.step ? 'text-[#FFD400]' : 'text-[#6F757B]'} />
                    </div>
                    <p className="text-[10px] text-[#A4A9AE] mt-0.5 line-clamp-1 font-sans">{item.desc}</p>
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
