import React from 'react';
import { 
  Search, 
  Mic, 
  MapPin, 
  Home, 
  GraduationCap, 
  Building2, 
  Cross, 
  Fuel, 
  Train,
  Radio,
  Sparkles
} from 'lucide-react';
import { MapRegion, POI, PositionState, BatteryState } from '../types';

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
  isOffline,
  onOpenSearch,
  onOpenVoice,
  onSelectDestination,
  onOpenEngineDrawer,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return <GraduationCap size={15} className="text-[#FFD400]" />;
      case 'home':
        return <Home size={15} className="text-[#22C55E]" />;
      case 'work':
      case 'tech_park':
        return <Building2 size={15} className="text-[#3B82F6]" />;
      case 'hospital':
        return <Cross size={15} className="text-[#EF4444]" />;
      case 'fuel':
        return <Fuel size={15} className="text-[#F59E0B]" />;
      case 'transit':
        return <Train size={15} className="text-purple-400" />;
      default:
        return <MapPin size={15} className="text-[#FFD400]" />;
    }
  };

  // Quick categories and saved places
  const quickPois = savedLocations.length > 0 
    ? savedLocations.slice(0, 5) 
    : activeRegion.pois.filter(p => p.isSaved).slice(0, 5);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 z-20 select-none">
      
      {/* 1. Top Floating Search Bar & Category Chips */}
      <div className="w-full space-y-2.5 pointer-events-auto">
        {/* Search Bar */}
        <div className="p-1.5 rounded-2xl bg-[#111315]/95 backdrop-blur-xl border border-[#2B2F33] shadow-2xl flex items-center gap-2">
          <div 
            onClick={onOpenSearch}
            className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] cursor-pointer transition-colors group"
          >
            <Search size={18} className="text-[#A4A9AE] group-hover:text-[#FFD400] transition-colors" />
            <span className="text-sm font-semibold text-[#A4A9AE] group-hover:text-[#F5F7F8] transition-colors">
              Where are you going?
            </span>
          </div>

          <button
            onClick={onOpenVoice}
            title="Voice Navigation"
            className="p-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6bf00] text-black shadow-md transition-transform active:scale-95 flex items-center justify-center flex-shrink-0 cursor-pointer"
          >
            <Mic size={18} />
          </button>
        </div>

        {/* Floating Quick Destination Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar font-display">
          {quickPois.map((poi) => (
            <button
              key={poi.id}
              onClick={() => onSelectDestination(poi)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111315]/90 backdrop-blur-md hover:bg-[#191C1F] border border-[#2B2F33] hover:border-[#FFD400]/40 text-xs font-semibold text-[#F5F7F8] whitespace-nowrap shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {getCategoryIcon(poi.category)}
              <span>{poi.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Bottom Floating Status Pills & Engine Control */}
      <div className="w-full flex items-center justify-between pointer-events-auto font-display">
        {/* Quick Status Telemetry Badges */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#111315]/90 backdrop-blur-md border border-[#2B2F33] text-[11px] font-bold shadow-md">
            <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'}`} />
            <span className={isOffline ? 'text-[#F59E0B]' : 'text-[#22C55E]'}>
              {isOffline ? 'Offline Mode' : 'Online'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#111315]/90 backdrop-blur-md border border-[#2B2F33] text-[11px] font-bold shadow-md">
            <Radio size={12} className={posState.isSensorAssisted ? 'text-[#3B82F6]' : 'text-[#22C55E]'} />
            <span className={posState.isSensorAssisted ? 'text-[#3B82F6]' : 'text-[#F5F7F8]'}>
              {posState.isSensorAssisted ? '6-DOF IMU' : 'GPS Active'}
            </span>
          </div>
        </div>

        {/* NavX Engine / USP Drawer Trigger */}
        <button
          onClick={onOpenEngineDrawer}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#191C1F]/90 backdrop-blur-md hover:bg-[#22262A] border border-[#2B2F33] hover:border-[#FFD400]/40 text-[#FFD400] text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
          title="Open NavX Technology & Simulation Panel"
        >
          <Sparkles size={13} />
          <span>NavX Engine</span>
        </button>
      </div>

    </div>
  );
};
