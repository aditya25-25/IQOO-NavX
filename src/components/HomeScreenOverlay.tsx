import React from 'react';
import { 
  Search, 
  Mic, 
  MapPin, 
  DownloadCloud, 
  HardDrive, 
  Home, 
  GraduationCap, 
  Building2, 
  Cross, 
  Fuel, 
  Train,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { MapRegion, POI, PositionState, BatteryState } from '../types';

interface HomeScreenOverlayProps {
  activeRegion: MapRegion;
  savedLocations: POI[];
  posState: PositionState;
  batteryState: BatteryState;
  isOffline: boolean;
  onOpenSearch: () => void;
  onOpenVoice: () => void;
  onOpenSavedLocations: () => void;
  onOpenDownloadRegion: () => void;
  onSelectDestination: (poi: POI) => void;
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
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return <GraduationCap size={16} className="text-[#FFD400]" />;
      case 'home':
        return <Home size={16} className="text-[#22C55E]" />;
      case 'work':
      case 'tech_park':
        return <Building2 size={16} className="text-[#3B82F6]" />;
      case 'hospital':
        return <Cross size={16} className="text-[#EF4444]" />;
      case 'fuel':
        return <Fuel size={16} className="text-[#F59E0B]" />;
      case 'transit':
        return <Train size={16} className="text-purple-400" />;
      default:
        return <MapPin size={16} className="text-[#FFD400]" />;
    }
  };

  // Saved / quick places
  const quickPois = savedLocations.length > 0 
    ? savedLocations.slice(0, 4) 
    : activeRegion.pois.filter(p => p.isSaved).slice(0, 4);

  return (
    <div className="w-full px-4 pb-2 z-40 select-none space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* 1. Main Search Bar: "Where to?" + Mic */}
      <div className="p-3.5 rounded-3xl bg-[#111315]/95 backdrop-blur-xl border border-[#2B2F33] shadow-2xl space-y-3.5">
        <div className="flex items-center gap-2.5">
          <div 
            onClick={onOpenSearch}
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] cursor-pointer transition-all group"
          >
            <Search size={18} className="text-[#A4A9AE] group-hover:text-[#FFD400] transition-colors" />
            <span className="text-sm font-semibold text-[#F5F7F8]">
              Where to?
            </span>
          </div>

          <button
            onClick={onOpenVoice}
            title="Voice Navigation"
            className="p-3 rounded-2xl bg-[#FFD400] hover:bg-[#e6bf00] text-black shadow-lg shadow-[rgba(255,212,0,0.2)] transition-all flex items-center justify-center flex-shrink-0"
          >
            <Mic size={20} />
          </button>
        </div>

        {/* 2. Saved Destinations Quick Access */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A4A9AE] font-display">
              Saved Destinations
            </span>
            <button 
              onClick={onOpenSavedLocations}
              className="text-[11px] font-semibold text-[#FFD400] hover:underline flex items-center gap-0.5 font-display"
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
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] hover:border-[#FFD400]/40 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-[#22262A] group-hover:bg-[#FFD400]/20 flex-shrink-0 transition-colors">
                  {getCategoryIcon(poi.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#F5F7F8] group-hover:text-[#FFD400] truncate block transition-colors">
                    {poi.name}
                  </span>
                  <span className="text-[10px] text-[#A4A9AE] truncate block">
                    {poi.address}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Quick Actions: Download Region, Saved Locations, Offline Maps */}
        <div className="grid grid-cols-3 gap-2 pt-1 font-display">
          <button
            onClick={onOpenDownloadRegion}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] text-center transition-all group"
          >
            <DownloadCloud size={16} className="text-[#FFD400] mb-1" />
            <span className="text-[10px] font-bold text-[#F5F7F8] group-hover:text-[#FFD400]">
              Download Region
            </span>
          </button>

          <button
            onClick={onOpenSavedLocations}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] text-center transition-all group"
          >
            <Bookmark size={16} className="text-[#22C55E] mb-1" />
            <span className="text-[10px] font-bold text-[#F5F7F8] group-hover:text-[#22C55E]">
              Saved Locations
            </span>
          </button>

          <button
            onClick={onOpenDownloadRegion}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] text-center transition-all group"
          >
            <HardDrive size={16} className="text-[#3B82F6] mb-1" />
            <span className="text-[10px] font-bold text-[#F5F7F8] group-hover:text-[#3B82F6]">
              Offline Maps
            </span>
          </button>
        </div>

        {/* 4. System Status Section (Functional Status Cards) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A4A9AE] font-display">
            System Telemetry & Hardware Status
          </span>

          <div className="grid grid-cols-4 gap-1.5 text-center font-display">
            {/* GPS Status Card */}
            <div className="p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
              <span className="text-[9px] uppercase font-bold text-[#A4A9AE] block">GPS</span>
              <span className={`text-[11px] font-extrabold block mt-0.5 ${
                posState.isSensorAssisted ? 'text-[#3B82F6]' : 'text-[#22C55E]'
              }`}>
                {posState.isSensorAssisted ? 'IMU SENSOR' : 'ACTIVE'}
              </span>
            </div>

            {/* Internet Status Card */}
            <div className="p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
              <span className="text-[9px] uppercase font-bold text-[#A4A9AE] block">Internet</span>
              <span className={`text-[11px] font-extrabold block mt-0.5 ${
                isOffline ? 'text-[#F59E0B]' : 'text-[#22C55E]'
              }`}>
                {isOffline ? 'OFFLINE' : 'CONNECTED'}
              </span>
            </div>

            {/* Battery Status Card */}
            <div className="p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
              <span className="text-[9px] uppercase font-bold text-[#A4A9AE] block">Battery</span>
              <span className={`text-[11px] font-extrabold block mt-0.5 ${
                batteryState.isLowBattery ? 'text-[#EF4444]' : 'text-[#22C55E]'
              }`}>
                {Math.round(batteryState.level * 100)}%
              </span>
            </div>

            {/* Offline Maps Status Card */}
            <div className="p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33]">
              <span className="text-[9px] uppercase font-bold text-[#A4A9AE] block">Offline Maps</span>
              <span className="text-[11px] font-extrabold text-[#FFD400] block mt-0.5">
                {activeRegion.isDownloaded ? 'READY' : 'AVAILABLE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
