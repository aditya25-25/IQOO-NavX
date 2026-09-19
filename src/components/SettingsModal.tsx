import React from 'react';
import { 
  X, 
  Cpu, 
  Battery, 
  HardDrive, 
  Activity, 
  Zap, 
  Volume2
} from 'lucide-react';
import { PositionState, BatteryState, MapRegion } from '../types';
import { voiceEngine } from '../voice/voiceGuidance';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  posState: PositionState;
  batteryState: BatteryState;
  activeRegion: MapRegion;
  onToggleUltraMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  posState,
  batteryState,
  activeRegion,
  onToggleUltraMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg bg-[#0f131d] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#ff4800]/20 text-[#ff4800]">
              <Activity size={16} />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-white font-display">
                IQOO NavX Sensor & System Telemetry
              </span>
              <p className="text-[10px] text-neutral-400">Offline IMU Fusion & Hardware Status</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* 1. Sensor-Assisted Positioning (IMU Dead Reckoning) Live Telemetry */}
          <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu size={15} className={posState.isSensorAssisted ? 'text-cyan-400' : 'text-green-400'} />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-display">
                  Sensor Fusion Engine (6-DOF IMU)
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                posState.isSensorAssisted 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {posState.isSensorAssisted ? 'IMU SENSOR ACTIVE' : 'RELIABLE GPS FIX'}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400">
              When GPS drops in tunnels or poor connectivity underpasses, NavX fuses device accelerometer, gyroscope, and compass data to maintain positioning continuity.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500 block uppercase font-sans font-bold">Coordinates</span>
                <span className="text-neutral-200 block">{posState.currentPosition.lat.toFixed(5)}, {posState.currentPosition.lng.toFixed(5)}</span>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500 block uppercase font-sans font-bold">Heading & Speed</span>
                <span className="text-neutral-200 block">{Math.round(posState.heading)}° • {Math.round(posState.speed * 3.6)} km/h</span>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500 block uppercase font-sans font-bold">Accuracy Radius</span>
                <span className="text-cyan-400 block">±{Math.round(posState.accuracyMeters)} meters</span>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-neutral-500 block uppercase font-sans font-bold">Position Source</span>
                <span className="text-green-400 block uppercase">{posState.source}</span>
              </div>
            </div>
          </div>

          {/* 2. Battery-Aware Navigation & Ultra Navigation Mode */}
          <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery size={15} className="text-[#ff4800]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-display">
                  Battery-Aware Navigation
                </span>
              </div>
              <span className="text-xs font-bold text-white font-mono">
                {Math.round(batteryState.level * 100)}%
              </span>
            </div>

            <p className="text-[11px] text-neutral-400">
              Ultra Navigation Mode strips non-essential map rendering and maximizes AMOLED power savings while keeping turn-by-turn guidance and voice guidance fully active.
            </p>

            <button
              onClick={onToggleUltraMode}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                batteryState.isUltraMode
                  ? 'bg-neutral-800 text-white border border-white/20'
                  : 'bg-[#ff4800] text-black hover:bg-[#ff6524] shadow-lg shadow-[#ff4800]/25'
              }`}
            >
              <Zap size={14} />
              <span>{batteryState.isUltraMode ? 'Exit Ultra Navigation Mode' : 'Enable Ultra Navigation Mode'}</span>
            </button>
          </div>

          {/* 3. Offline Map Engine & Database */}
          <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/5 space-y-2">
            <div className="flex items-center gap-2">
              <HardDrive size={15} className="text-green-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white font-display">
                Offline Routing Engine
              </span>
            </div>
            <div className="text-[11px] text-neutral-300 space-y-1">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Active Map:</span>
                <span className="font-semibold text-white">{activeRegion.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Database Size:</span>
                <span className="font-semibold text-white">{activeRegion.sizeMB} MB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Graph Algorithm:</span>
                <span className="font-mono text-green-400">Dijkstra Shortest Path</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Network Dependency:</span>
                <span className="font-semibold text-green-400">0 KB (Zero Internet Required)</span>
              </div>
            </div>
          </div>

          {/* 4. Voice Guidance Test */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
              <Volume2 size={15} className="text-[#ff4800]" />
              <span>Test Navigation Voice Engine</span>
            </div>

            <button
              onClick={() => voiceEngine.speak('IQOO NavX offline voice guidance is operating normally.', true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              Test Voice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
