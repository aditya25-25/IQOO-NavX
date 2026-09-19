import React from 'react';
import { 
  Search, 
  Mic, 
  MapPin, 
  DownloadCloud, 
  Check, 
  Cpu, 
  WifiOff, 
  HardDrive, 
  Home, 
  GraduationCap, 
  Building2, 
  Cross, 
  Fuel, 
  Train,
  ArrowRight,
  Zap
} from 'lucide-react';
import { MapRegion, POI, PositionState, BatteryState } from '../types';

interface HomeScreenOverlayProps {
  activeRegion: MapRegion;
  savedLocations?: POI[];
  posState: PositionState;
  batteryState: BatteryState;
  isOffline?: boolean;
  onOpenSearch: () => void;
  onOpenVoice: () => void;
  onOpenRegions: () => void;
  onSelectDestination: (poi: POI) => void;
  onToggleUltraMode: () => void;
}

export const HomeScreenOverlay: React.FC<HomeScreenOverlayProps> = ({
  activeRegion,
  posState,
  batteryState,
  onOpenSearch,
  onOpenVoice,
  onOpenRegions,
  onSelectDestination,
  onToggleUltraMode,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return <GraduationCap size={16} className="text-amber-400" />;
      case 'home':
        return <Home size={16} className="text-green-400" />;
      case 'tech_park':
        return <Building2 size={16} className="text-cyan-400" />;
      case 'hospital':
        return <Cross size={16} className="text-red-400" />;
      case 'fuel':
        return <Fuel size={16} className="text-orange-400" />;
      case 'transit':
        return <Train size={16} className="text-purple-400" />;
      default:
        return <MapPin size={16} className="text-[#ff4800]" />;
    }
  };

  // Extract primary quick-access POIs
  const quickPois = activeRegion.pois.slice(0, 4);

  return (
    <div className="w-full px-4 pb-2 z-40 select-none space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* 1. Large Main Search Bar: "Where to?" */}
      <div className="p-3 rounded-3xl bg-[#111624]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-3">
        <div className="flex items-center gap-2.5">
          <div 
            onClick={onOpenSearch}
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181e2e] hover:bg-[#1f263a] border border-white/5 hover:border-[#ff4800]/40 cursor-pointer transition-all group"
          >
            <Search size={18} className="text-neutral-400 group-hover:text-[#ff4800] transition-colors" />
            <span className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors">
              Where to?
            </span>
          </div>

          <button
            onClick={onOpenVoice}
            title="AI Voice Navigation"
            className="p-3 rounded-2xl bg-[#ff4800] hover:bg-[#ff6524] text-black shadow-lg shadow-[#ff4800]/25 transition-all flex items-center justify-center"
          >
            <Mic size={20} />
          </button>
        </div>

        {/* 2. Quick Saved Places Chips */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-display">
              Saved & Quick Destinations
            </span>
            <button 
              onClick={onOpenSearch}
              className="text-[11px] font-semibold text-[#ff4800] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickPois.map((poi) => (
              <button
                key={poi.id}
                onClick={() => onSelectDestination(poi)}
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-black/40 hover:bg-white/5 border border-white/5 hover:border-[#ff4800]/40 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#ff4800]/20 flex-shrink-0 transition-colors">
                  {getCategoryIcon(poi.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white group-hover:text-[#ff4800] truncate block transition-colors">
                    {poi.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 truncate block">
                    {poi.address}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Download Regional Offline Map Card */}
        <div 
          onClick={onOpenRegions}
          className="flex items-center justify-between p-3 rounded-2xl bg-[#161c2c] hover:bg-[#1c2336] border border-white/5 hover:border-[#ff4800]/40 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/15 text-green-400">
              <HardDrive size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">
                  {activeRegion.name}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-green-500/20 text-green-400 border border-green-500/40">
                  {activeRegion.isDownloaded ? 'DOWNLOADED' : 'AVAILABLE'}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 block">
                {activeRegion.sizeMB} MB offline road graph package loaded
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/5 text-neutral-300">
            {activeRegion.isDownloaded ? <Check size={16} className="text-green-400" /> : <DownloadCloud size={16} />}
          </div>
        </div>

        {/* 4. Live System Status Bar */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-display">
          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-neutral-400">
              <Cpu size={12} className={posState.isSensorAssisted ? 'text-cyan-400' : 'text-green-400'} />
              <span>Positioning</span>
            </div>
            <span className={`text-xs font-bold block mt-0.5 ${posState.isSensorAssisted ? 'text-cyan-400' : 'text-green-400'}`}>
              {posState.isSensorAssisted ? 'Sensor IMU' : 'GPS Signal'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-neutral-400">
              <WifiOff size={12} className="text-amber-400" />
              <span>Data Engine</span>
            </div>
            <span className="text-xs font-bold text-amber-300 block mt-0.5">
              Offline-Ready
            </span>
          </div>

          <div 
            onClick={onToggleUltraMode}
            className="p-2 rounded-xl bg-black/30 border border-white/5 cursor-pointer hover:border-[#ff4800]/40 transition-colors"
          >
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-neutral-400">
              <Zap size={12} className={batteryState.isUltraMode ? 'text-[#ff4800]' : 'text-neutral-400'} />
              <span>Power Mode</span>
            </div>
            <span className={`text-xs font-bold block mt-0.5 ${batteryState.isUltraMode ? 'text-[#ff4800]' : 'text-neutral-200'}`}>
              {batteryState.isUltraMode ? 'Ultra Mode' : `${Math.round(batteryState.level * 100)}% Normal`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
