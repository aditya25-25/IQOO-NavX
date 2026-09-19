import React from 'react';

import { MapView } from './MapView';
import { HomeScreenOverlay } from './HomeScreenOverlay';
import { RouteContextCard } from './RouteContextCard';

import {
  Coordinates,
  MapRegion,
  POI,
  PositionState,
  BatteryState,
} from '../types';

import { NavigationProgress } from '../engine/navigationController';

interface MapExperienceProps {
  currentPosition: Coordinates;
  positionState: PositionState;
  activeRoute: NavigationProgress['activeRoute'];
  activeRegion: MapRegion;
  savedLocations: POI[];
  isUltraMode: boolean;

  isIdle: boolean;
  isNavigating: boolean;

  posState: PositionState;
  batteryState: BatteryState;
  isOffline: boolean;

  onSelectPOI: (poi: POI) => void;

  onOpenSearch: () => void;
  onOpenVoice: () => void;
  onOpenSavedLocations: () => void;
  onOpenDownloadRegion: () => void;
  onSelectDestination: (poi: POI) => void;
  onOpenEngineDrawer: () => void;
}

export const MapExperience: React.FC<MapExperienceProps> = ({
  currentPosition,
  positionState,
  activeRoute,
  activeRegion,
  savedLocations,
  isUltraMode,

  isIdle,
  isNavigating,

  posState,
  batteryState,
  isOffline,

  onSelectPOI,

  onOpenSearch,
  onOpenVoice,
  onOpenSavedLocations,
  onOpenDownloadRegion,
  onSelectDestination,
  onOpenEngineDrawer,
}) => {
  return (
    <div className="flex-1 w-full relative min-h-[420px]">
      <MapView
        currentPosition={currentPosition}
        positionState={positionState}
        activeRoute={activeRoute}
        activeRegion={activeRegion}
        savedLocations={savedLocations}
        isUltraMode={isUltraMode}
        onSelectPOI={onSelectPOI}
      />

      {isIdle && (
        <HomeScreenOverlay
          activeRegion={activeRegion}
          savedLocations={savedLocations}
          posState={posState}
          batteryState={batteryState}
          isOffline={isOffline}
          onOpenSearch={onOpenSearch}
          onOpenVoice={onOpenVoice}
          onOpenSavedLocations={onOpenSavedLocations}
          onOpenDownloadRegion={onOpenDownloadRegion}
          onSelectDestination={onSelectDestination}
          onOpenEngineDrawer={onOpenEngineDrawer}
        />
      )}

      {isNavigating && activeRoute && (
        <div className="absolute bottom-3 left-0 right-0 z-30 pointer-events-none">
          <RouteContextCard context={activeRoute.context} />
        </div>
      )}
    </div>
  );
};

export default MapExperience;
