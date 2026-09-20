```tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Navigation,
  Star,
  Home,
  GraduationCap,
  Building2,
  Cross,
  Fuel,
  Train,
  MapPin,
  Check,
  Cloud,
  CloudOff,
  RotateCw,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { POI, Coordinates } from '../types';
import { getDistanceMeters } from '../engine/offlineRouter';
import { User } from '@supabase/supabase-js';

interface SavedLocationsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  savedLocations: POI[];
  currentCoord: Coordinates;
  currentUser: User | null;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRefresh?: () => void;
  onOpenAuth?: () => void;
  onSelectDestination: (poi: POI) => void;
  onAddLocation: (poi: POI) => void;
  onDeleteLocation: (id: string) => void;
}

export const SavedLocationsScreen: React.FC<SavedLocationsScreenProps> = ({
  isOpen,
  onClose,
  savedLocations,
  currentCoord,
  currentUser,
  isLoading = false,
  errorMessage = null,
  onRefresh,
  onOpenAuth,
  onSelectDestination,
  onAddLocation,
  onDeleteLocation,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCategory, setNewCategory] = useState<
    'home' | 'college' | 'work' | 'hospital' | 'fuel' | 'transit'
  >('work');

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return (
          <GraduationCap
            size={17}
            className="text-[#FFD400]"
            strokeWidth={2.3}
          />
        );

      case 'home':
        return (
          <Home
            size={17}
            className="text-[#22C55E]"
            strokeWidth={2.3}
          />
        );

      case 'work':
      case 'tech_park':
        return (
          <Building2
            size={17}
            className="text-[#3B82F6]"
            strokeWidth={2.3}
          />
        );

      case 'hospital':
        return (
          <Cross
            size={17}
            className="text-[#EF4444]"
            strokeWidth={2.3}
          />
        );

      case 'fuel':
        return (
          <Fuel
            size={17}
            className="text-[#F59E0B]"
            strokeWidth={2.3}
          />
        );

      case 'transit':
        return (
          <Train
            size={17}
            className="text-[#A78BFA]"
            strokeWidth={2.3}
          />
        );

      default:
        return (
          <MapPin
            size={17}
            className="text-[#FFD400]"
            strokeWidth={2.3}
          />
        );
    }
  };

  const calculateDistanceKm = (poiCoord: Coordinates) => {
    const distMeters = getDistanceMeters(currentCoord, poiCoord);
    return (distMeters / 1000).toFixed(1);
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) return;

    const newPoi: POI = {
      id: `saved-${Date.now()}`,
      name: newName.trim(),
      category: newCategory === 'work' ? 'tech_park' : newCategory,
      coordinate: {
        lat: currentCoord.lat + (Math.random() - 0.5) * 0.02,
        lng: currentCoord.lng + (Math.random() - 0.5) * 0.02,
      },
      address: newAddress.trim() || 'Saved Custom Location',
      regionId: 'bengaluru_tech_corridor',
      isSaved: true,
    };

    onAddLocation(newPoi);
    setNewName('');
    setNewAddress('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#08090A] text-[#F5F7F8] select-none animate-in fade-in duration-200">
      {/* Header */}
      <header className="shrink-0 border-b border-[#2B2F33] bg-[#08090A] px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to map"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#111315] text-[#A4A9AE] transition-all hover:border-[#FFD400]/40 hover:bg-[#191C1F] hover:text-[#F5F7F8] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-black tracking-tight text-[#F5F7F8]">
                Saved Locations
              </h1>

              <div className="mt-0.5 flex items-center gap-1.5 text-[9px]">
                {currentUser ? (
                  <span className="flex items-center gap-1 font-semibold text-[#22C55E]">
                    <Cloud size={11} />
                    Cloud synced
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="flex items-center gap-1 font-medium text-[#6F757B] transition-colors hover:text-[#FFD400]"
                  >
                    <CloudOff size={11} />
                    Local only · Sign in to sync
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                aria-label="Refresh saved locations"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#111315] text-[#A4A9AE] transition-all hover:border-[#FFD400]/40 hover:bg-[#191C1F] hover:text-[#FFD400] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCw
                  size={15}
                  className={isLoading ? 'animate-spin' : ''}
                />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className={[
                'flex h-10 items-center gap-1.5 rounded-xl px-3 text-[10px] font-black uppercase tracking-wide transition-all active:scale-[0.97]',
                isAddingNew
                  ? 'border border-[#2B2F33] bg-[#191C1F] text-[#A4A9AE]'
                  : 'bg-[#FFD400] text-black hover:bg-[#e6bf00]',
              ].join(' ')}
            >
              {isAddingNew ? <X size={14} /> : <Plus size={15} />}
              <span className="hidden sm:inline">
                {isAddingNew ? 'Close' : 'Add Place'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4">
        {/* Error */}
        {errorMessage && (
          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/10 p-3">
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0 text-[#EF4444]"
            />

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#FCA5A5]">
                Sync error
              </p>

              <p className="mt-0.5 text-[11px] leading-relaxed text-[#A4A9AE]">
                {errorMessage}
              </p>
            </div>

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-black text-[#FFD400] transition-colors hover:bg-[#FFD400]/10"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Add location form */}
        {isAddingNew && (
          <form
            onSubmit={handleCreateLocation}
            className="my-3 space-y-3 rounded-2xl border border-[#2B2F33] bg-[#111315] p-4 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-[#F5F7F8]">
                  Add saved location
                </p>

                <p className="mt-0.5 text-[9px] text-[#6F757B]">
                  Create a quick-access destination
                </p>
              </div>

              <span className="rounded-full border border-[#2B2F33] bg-[#191C1F] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#6F757B]">
                New
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                required
                placeholder="Place name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-[#2B2F33] bg-[#191C1F] px-3 py-2.5 text-xs text-[#F5F7F8] outline-none placeholder:text-[#6F757B] transition-colors focus:border-[#FFD400]/70 focus:ring-2 focus:ring-[#FFD400]/10"
              />

              <input
                type="text"
                placeholder="Address / area"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full rounded-xl border border-[#2B2F33] bg-[#191C1F] px-3 py-2.5 text-xs text-[#F5F7F8] outline-none placeholder:text-[#6F757B] transition-colors focus:border-[#FFD400]/70 focus:ring-2 focus:ring-[#FFD400]/10"
              />
            </div>

            <div>
              <span className="mb-2 block text-[9px] font-black uppercase tracking-wider text-[#6F757B]">
                Category
              </span>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {(
                  ['work', 'college', 'home', 'fuel', 'hospital'] as const
                ).map((cat) => {
                  const selected = newCategory === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={[
                        'shrink-0 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide transition-all active:scale-95',
                        selected
                          ? 'bg-[#FFD400] text-black'
                          : 'border border-[#2B2F33] bg-[#191C1F] text-[#A4A9AE] hover:border-[#FFD400]/30 hover:text-[#F5F7F8]',
                      ].join(' ')}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#FFD400] py-2.5 text-xs font-black uppercase tracking-wide text-black transition-all hover:bg-[#e6bf00] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60"
            >
              <Check size={14} />
              Save Location
            </button>
          </form>
        )}

        {/* Locations */}
        <div className="flex-1 overflow-y-auto py-3 [scrollbar-width:thin]">
          {isLoading && savedLocations.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2B2F33] bg-[#111315]">
                <Loader2
                  size={22}
                  className="animate-spin text-[#FFD400]"
                />
              </div>

              <p className="mt-3 text-xs font-bold text-[#F5F7F8]">
                Loading saved places
              </p>

              <p className="mt-1 text-[10px] text-[#6F757B]">
                Syncing your destinations
              </p>
            </div>
          ) : savedLocations.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2B2F33] bg-[#111315]">
                <Star size={25} className="text-[#6F757B]" />
              </div>

              <p className="mt-4 text-sm font-black text-[#F5F7F8]">
                No saved locations
              </p>

              <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-[#6F757B]">
                Save Home, College, Work, or any frequent destination for
                faster navigation.
              </p>

              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="mt-4 rounded-xl bg-[#FFD400] px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-black transition-all hover:bg-[#e6bf00] active:scale-95"
              >
                Add First Place
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {savedLocations.map((poi) => {
                const distance = calculateDistanceKm(poi.coordinate);

                return (
                  <article
                    key={poi.id}
                    className="group rounded-2xl border border-[#2B2F33] bg-[#111315] p-3 transition-all duration-200 hover:border-[#3A3F44] hover:bg-[#191C1F]"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectDestination(poi);
                          onClose();
                        }}
                        aria-label={`Navigate to ${poi.name}`}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60 rounded-xl"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#191C1F] transition-colors group-hover:border-[#FFD400]/20 group-hover:bg-[#FFD400]/10">
                          {getCategoryIcon(poi.category)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs font-black text-[#F5F7F8]">
                              {poi.name}
                            </span>

                            <Star
                              size={10}
                              className="shrink-0 fill-[#FFD400] text-[#FFD400]"
                            />
                          </div>

                          <p className="mt-0.5 truncate text-[10px] text-[#6F757B]">
                            {poi.address}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-[#A4A9AE]">
                              {distance} km away
                            </span>

                            <span className="h-1 w-1 rounded-full bg-[#2B2F33]" />

                            <span className="text-[9px] font-bold text-[#22C55E]">
                              Offline ready
                            </span>
                          </div>
                        </div>
                      </button>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectDestination(poi);
                            onClose();
                          }}
                          aria-label={`Start navigation to ${poi.name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400] text-black transition-all hover:bg-[#e6bf00] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60"
                        >
                          <Navigation
                            size={15}
                            className="fill-black"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteLocation(poi.id)}
                          aria-label={`Delete ${poi.name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#191C1F] text-[#6F757B] transition-all hover:border-[#EF4444]/30 hover:bg-[#EF4444]/10 hover:text-[#EF4444] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]/50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
```
