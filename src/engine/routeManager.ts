import { Coordinates, MapRegion, Route } from '../types';
import { calculateOfflineRoute } from './offlineRouter';
import { calculateOnlineRoute } from './onlineRouter';

export class RouteManager {
  private isOfflineForced: boolean = true; // Offline-first by default for IQOO NavX

  constructor(offlineFirst = true) {
    this.isOfflineForced = offlineFirst;
  }

  public setOfflineSimulation(offline: boolean) {
    this.isOfflineForced = offline;
  }

  public isOfflineMode(): boolean {
    return this.isOfflineForced || !navigator.onLine;
  }

  public async calculateRoute(
    origin: Coordinates,
    originName: string,
    destination: Coordinates,
    destinationName: string,
    region: MapRegion
  ): Promise<{ route: Route; source: 'offline' | 'online' } | null> {
    // If offline mode is enabled or network is down, execute offline route solver directly
    if (this.isOfflineMode()) {
      const offlineRoute = calculateOfflineRoute(origin, originName, destination, destinationName, region);
      if (offlineRoute) {
        return { route: offlineRoute, source: 'offline' };
      }
      return null;
    }

    // Attempt online first, then automatically fall back to offline
    try {
      const onlineRoute = await calculateOnlineRoute(origin, originName, destination, destinationName);
      if (onlineRoute) {
        return { route: onlineRoute, source: 'online' };
      }
    } catch {
      // Fallback
    }

    const offlineRoute = calculateOfflineRoute(origin, originName, destination, destinationName, region);
    if (offlineRoute) {
      return { route: offlineRoute, source: 'offline' };
    }

    return null;
  }
}
