```tsx
import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  Mic,
  MapPin,
  Star,
  Navigation,
  GraduationCap,
  Building2,
  Home,
  Fuel,
  Cross,
  Train,
  X,
} from 'lucide-react';
import { MapRegion, POI, Coordinates } from '../types';
import { getDistanceMeters } from '../engine/offlineRouter';

interface SearchScreenProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: MapRegion;
  currentCoord: Coordinates;
  savedLocations: POI[];
  onSelectDestination: (poi: POI) => void;
  onOpenVoice: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  isOpen,
  onClose,
  activeRegion,
  currentCoord,
  savedLocations,
  onSelectDestination,
  onOpenVoice,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const allPois = [...activeRegion.pois, ...savedLocations];
  const uniquePois = Array.from(
    new Map(allPois.map((p) => [p.id, p])).values()
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return <GraduationCap size={17} className="text-[#FFD400]" />;
      case 'home':
        return <Home size={17} className="text-[#22C55E]" />;
      case 'work':
      case 'tech_park':
        return <Building2 size={17} className="text-[#3B82F6]" />;
      case 'hospital':
        return <Cross size={17} className="text-[#EF4444]" />;
      case 'fuel':
        return <Fuel size={17} className="text-[#F59E0B]" />;
      case 'transit':
        return <Train size={17} className="text-[#A78BFA]" />;
      default:
        return <MapPin size={17} className="text-[#FFD400]" />;
    }
  };

  const calculateDistanceKm = (poiCoord: Coordinates) => {
    const distMeters = getDistanceMeters(currentCoord, poiCoord);
    return (distMeters / 1000).toFixed(1);
  };

  const filteredPois = uniquePois.filter((poi) => {
    const normalizedQuery = query.trim().toLowerCase();

    const matchesSearch =
      !normalizedQuery ||
      poi.name.toLowerCase().includes(normalizedQuery) ||
      poi.address.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      selectedCategory === 'all' || poi.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#08090A] text-[#F5F7F8] flex flex-col select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#2B2F33]/80">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="navx-icon-btn flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111315] border border-[#2B2F33] text-[#A4A9AE] transition-all duration-200 hover:bg-[#191C1F] hover:text-[#F5F7F8] active:scale-95"
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="flex-1">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F757B] pointer-events-none"
              />

              <input
                type="text"
                autoFocus
                placeholder="Where to?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-11 bg-[#111315] border border-[#2B2F33] focus:border-[#FFD400] rounded-2xl pl-10 pr-10 text-sm font-medium text-[#F5F7F8] placeholder-[#6F757B] focus:outline-none transition-all duration-200"
                aria-label="Search destination"
              />

              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg flex items-center justify-center text-[#6F757B] hover:text-[#F5F7F8] hover:bg-[#22262A] active:scale-90 transition-all"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenVoice();
            }}
            className="h-11 w-11 rounded-2xl bg-[#FFD400] text-black flex items-center justify-center shadow-[0_6px_18px_rgba(255,212,0,0.18)] transition-all duration-200 hover:bg-[#F5C900] active:scale-95"
            title="Voice Search"
            aria-label="Voice Search"
          >
            <Mic size={19} />
          </button>
        </div>

        {/* Search Context */}
        <div className="flex items-center gap-2 mt-3 px-1">
          <MapPin size={13} className="text-[#3B82F6]" />
          <span className="text-[11px] text-[#A4A9AE]">
            Searching within
          </span>
          <span className="text-[11px] font-semibold text-[#F5F7F8] truncate">
            {activeRegion.name}
          </span>
          <span className="ml-auto text-[10px] text-[#6F757B]">
            Offline ready
          </span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-4 pt-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Places' },
            { id: 'college', label: 'Colleges' },
            { id: 'tech_park', label: 'Tech Parks' },
            { id: 'home', label: 'Saved Home' },
            { id: 'hospital', label: 'Hospitals' },
            { id: 'fuel', label: 'Fuel & EV' },
            { id: 'transit', label: 'Transit' },
          ].map((cat) => {
            const active = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-9 px-3.5 rounded-full text-[11px] font-semibold whitespace-nowrap border transition-all duration-200 active:scale-95 ${
                  active
                    ? 'bg-[#FFD400] text-black border-[#FFD400] shadow-[0_4px_14px_rgba(255,212,0,0.14)]'
                    : 'bg-[#111315] text-[#A4A9AE] border-[#2B2F33] hover:bg-[#191C1F] hover:text-[#F5F7F8]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="px-4 pt-4 pb-2 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#6F757B]">
            {query ? 'Search results' : 'Nearby destinations'}
          </p>

          <p className="mt-1 text-sm font-semibold text-[#F5F7F8]">
            {query ? `"${query}"` : 'Ready to navigate'}
          </p>
        </div>

        <span className="text-[10px] font-medium text-[#6F757B] whitespace-nowrap">
          {filteredPois.length} {filteredPois.length === 1 ? 'place' : 'places'}
        </span>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {filteredPois.length === 0 ? (
          <div className="min-h-[280px] flex flex-col items-center justify-center text-center px-8">
            <div className="h-16 w-16 rounded-2xl bg-[#111315] border border-[#2B2F33] flex items-center justify-center mb-4">
              <Search size={25} className="text-[#6F757B]" />
            </div>

            <p className="text-sm font-bold text-[#F5F7F8]">
              No destinations found
            </p>

            <p className="text-xs text-[#6F757B] mt-1.5 leading-relaxed max-w-[260px]">
              Try a different place, address, college, road, or category.
            </p>

            {query && (
              <button
                onClick={() => setQuery('')}
                className="mt-4 px-4 py-2 rounded-xl bg-[#191C1F] border border-[#2B2F33] text-[11px] font-semibold text-[#A4A9AE] hover:text-[#F5F7F8] hover:border-[#FFD400]/40 transition-all active:scale-95"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPois.map((poi) => {
              const distance = calculateDistanceKm(poi.coordinate);

              return (
                <button
                  key={poi.id}
                  type="button"
                  onClick={() => {
                    onSelectDestination(poi);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 rounded-2xl bg-[#111315] border border-[#2B2F33] hover:bg-[#191C1F] hover:border-[#FFD400]/40 active:scale-[0.99] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    {/* POI Icon */}
                    <div className="h-11 w-11 rounded-xl bg-[#191C1F] border border-[#2B2F33] group-hover:border-[#FFD400]/30 flex items-center justify-center flex-shrink-0 transition-all">
                      {getCategoryIcon(poi.category)}
                    </div>

                    {/* Destination Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm font-bold text-[#F5F7F8] truncate group-hover:text-[#FFD400] transition-colors">
                          {poi.name}
                        </span>

                        {poi.isSaved && (
                          <span className="inline-flex items-center gap-1 flex-shrink-0 px-1.5 py-0.5 rounded-md bg-[#FFD400]/10 border border-[#FFD400]/20 text-[8px] font-bold tracking-wide text-[#FFD400]">
                            <Star size={8} className="fill-[#FFD400]" />
                            SAVED
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#A4A9AE] truncate mt-1">
                        {poi.address}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold text-[#F5F7F8]">
                          {distance} km
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[#2B2F33]" />

                        <span className="flex items-center gap-1 text-[10px] text-[#22C55E] font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                          Offline ready
                        </span>
                      </div>
                    </div>

                    {/* Navigate */}
                    <div className="h-10 w-10 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#A4A9AE] group-hover:bg-[#FFD400] group-hover:border-[#FFD400] group-hover:text-black transition-all flex-shrink-0">
                      <Navigation size={15} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
```
