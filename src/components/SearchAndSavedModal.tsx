import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  DownloadCloud, 
  Check, 
  X, 
  Navigation, 
  HardDrive, 
  GraduationCap, 
  Building2, 
  Home, 
  Fuel, 
  Cross,
  Train
} from 'lucide-react';
import { MapRegion, POI } from '../types';
import { REGIONS } from '../data/regions';

interface SearchAndSavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: MapRegion;
  onSelectRegion: (region: MapRegion) => void;
  onSelectDestination: (poi: POI) => void;
  savedLocations: POI[];
}

export const SearchAndSavedModal: React.FC<SearchAndSavedModalProps> = ({
  isOpen,
  onClose,
  activeRegion,
  onSelectRegion,
  onSelectDestination,
  savedLocations,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [regionsList, setRegionsList] = useState<MapRegion[]>(REGIONS);
  const [activeTab, setActiveTab] = useState<'places' | 'offline_maps'>('places');

  if (!isOpen) return null;

  const allPois = [...activeRegion.pois, ...savedLocations];
  const uniquePois = Array.from(new Map(allPois.map((p) => [p.id, p])).values());

  const filteredPois = uniquePois.filter((poi) => {
    const matchesSearch =
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || poi.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return <GraduationCap size={16} className="text-amber-400" />;
      case 'home':
        return <Home size={16} className="text-green-400" />;
      case 'tech_park':
        return <Building2 size={16} className="text-cyan-400" />;
      case 'fuel':
        return <Fuel size={16} className="text-orange-400" />;
      case 'hospital':
        return <Cross size={16} className="text-red-400" />;
      case 'transit':
        return <Train size={16} className="text-purple-400" />;
      default:
        return <MapPin size={16} className="text-[#ff4800]" />;
    }
  };

  const handleToggleDownload = (regId: string) => {
    setRegionsList((prev) =>
      prev.map((r) => {
        if (r.id === regId) {
          const updated = { ...r, isDownloaded: !r.isDownloaded };
          if (updated.id === activeRegion.id) {
            onSelectRegion(updated);
          }
          return updated;
        }
        return r;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg bg-[#0f131d] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff4800]" />
            <span className="text-sm font-bold uppercase tracking-wider text-white font-display">
              Destination & Offline Maps
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 p-2 gap-2 bg-black/30">
          <button
            onClick={() => setActiveTab('places')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'places'
                ? 'bg-[#ff4800] text-black shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Search & Saved Places
          </button>

          <button
            onClick={() => setActiveTab('offline_maps')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'offline_maps'
                ? 'bg-[#ff4800] text-black shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <HardDrive size={14} />
            <span>Offline Regions ({regionsList.filter((r) => r.isDownloaded).length})</span>
          </button>
        </div>

        {/* TAB 1: PLACES & DESTINATIONS */}
        {activeTab === 'places' && (
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {/* Search Input Bar */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search destination, college, tech park..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181d2a] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff4800]"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Places' },
                { id: 'college', label: 'Colleges' },
                { id: 'tech_park', label: 'Tech Parks' },
                { id: 'home', label: 'Saved Home' },
                { id: 'hospital', label: 'Hospitals' },
                { id: 'fuel', label: 'Fuel & EV' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#ff4800]/20 text-[#ff4800] border border-[#ff4800]/40'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* POIs List */}
            <div className="space-y-2 pt-1">
              {filteredPois.map((poi) => (
                <div
                  key={poi.id}
                  onClick={() => {
                    onSelectDestination(poi);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-[#141824] hover:bg-[#1a2030] border border-white/5 hover:border-[#ff4800]/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-[#ff4800]/20 transition-colors">
                      {getCategoryIcon(poi.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-[#ff4800] transition-colors">
                          {poi.name}
                        </span>
                        {poi.isSaved && (
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 line-clamp-1">
                        {poi.address}
                      </span>
                    </div>
                  </div>

                  <button className="p-2 rounded-xl bg-[#ff4800]/15 group-hover:bg-[#ff4800] text-[#ff4800] group-hover:text-black transition-all">
                    <Navigation size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OFFLINE MAP REGIONS */}
        {activeTab === 'offline_maps' && (
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            <p className="text-xs text-neutral-400">
              Download regional offline map packages to navigate, search POIs, and calculate routes without cellular or internet data.
            </p>

            <div className="space-y-2.5">
              {regionsList.map((region) => {
                const isCurrent = region.id === activeRegion.id;
                return (
                  <div
                    key={region.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#ff4800]/10 border-[#ff4800]/50'
                        : 'bg-[#141824] border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {region.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#ff4800] text-black">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {region.description}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-neutral-500 mt-2 font-mono">
                          <span>Size: {region.sizeMB} MB</span>
                          <span>•</span>
                          <span>Version: {region.version}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 items-end">
                        <button
                          onClick={() => handleToggleDownload(region.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            region.isDownloaded
                              ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                          {region.isDownloaded ? (
                            <>
                              <Check size={13} />
                              <span>Downloaded</span>
                            </>
                          ) : (
                            <>
                              <DownloadCloud size={13} />
                              <span>Download</span>
                            </>
                          )}
                        </button>

                        {region.isDownloaded && !isCurrent && (
                          <button
                            onClick={() => onSelectRegion(region)}
                            className="text-[11px] font-semibold text-[#ff4800] hover:underline"
                          >
                            Set as Active Map
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
