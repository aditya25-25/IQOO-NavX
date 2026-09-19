import React, { useEffect, useRef } from 'react';
import { Coordinates, MapRegion, POI, PositionState, Route } from '../types';
import L from 'leaflet';

interface MapViewProps {
  currentPosition: Coordinates;
  positionState: PositionState;
  activeRoute: Route | null;
  activeRegion: MapRegion;
  savedLocations: POI[];
  isUltraMode: boolean;
  onSelectPOI?: (poi: POI) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  currentPosition,
  positionState,
  activeRoute,
  activeRegion,
  savedLocations,
  isUltraMode,
  onSelectPOI,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const roadGraphLayerRef = useRef<L.LayerGroup | null>(null);
  const poiLayerRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [activeRegion.center.lat, activeRegion.center.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Carto basemap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;
    roadGraphLayerRef.current = L.layerGroup().addTo(map);
    poiLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeRegion.center.lat, activeRegion.center.lng]);

  // Render Offline Regional Vector Road Graph
  useEffect(() => {
    if (!mapInstanceRef.current || !roadGraphLayerRef.current) return;
    roadGraphLayerRef.current.clearLayers();

    activeRegion.edges.forEach((edge) => {
      const fromNode = activeRegion.nodes[edge.from];
      const toNode = activeRegion.nodes[edge.to];
      if (fromNode && toNode) {
        let color = isUltraMode ? '#222222' : '#1a2233';
        let weight = 4;
        let dashArray = undefined;

        if (edge.isHighway) {
          color = isUltraMode ? '#444444' : '#28354f';
          weight = 6;
        }
        if (edge.isPoorConnectivity) {
          color = isUltraMode ? '#ff0055' : '#e11d48';
          dashArray = '6, 6';
        }
        if (edge.isUnpaved) {
          color = '#b45309';
          dashArray = '4, 4';
        }

        const line = L.polyline(
          [
            [fromNode.coord.lat, fromNode.coord.lng],
            [toNode.coord.lat, toNode.coord.lng],
          ],
          { color, weight, opacity: 0.85, dashArray }
        );
        line.addTo(roadGraphLayerRef.current!);
      }
    });
  }, [activeRegion, isUltraMode]);

  // Render POIs & Saved Places
  useEffect(() => {
    if (!mapInstanceRef.current || !poiLayerRef.current) return;
    poiLayerRef.current.clearLayers();

    const allPois = [...activeRegion.pois, ...savedLocations];
    const uniquePois = Array.from(new Map(allPois.map((p) => [p.id, p])).values());

    uniquePois.forEach((poi) => {
      const isSaved = poi.isSaved;
      const markerHtml = `
        <div style="
          background: ${isSaved ? '#ff4800' : '#141a29'};
          border: 2px solid ${isSaved ? '#ffffff' : '#3b4861'};
          color: #ffffff;
          border-radius: 9999px;
          padding: 4px 9px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        ">
          <span>${isSaved ? '★' : '📍'}</span>
          <span>${poi.name}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'poi-custom-marker',
        iconAnchor: [30, 15],
      });

      const marker = L.marker([poi.coordinate.lat, poi.coordinate.lng], { icon: customIcon });
      marker.on('click', () => {
        if (onSelectPOI) onSelectPOI(poi);
      });
      marker.addTo(poiLayerRef.current!);
    });
  }, [activeRegion.pois, savedLocations, onSelectPOI]);

  // Render Active Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (activeRoute && activeRoute.coordinates.length > 1) {
      const latlngs: [number, number][] = activeRoute.coordinates.map((c) => [c.lat, c.lng]);
      const routeColor = positionState.isSensorAssisted ? '#00e5ff' : '#ff4800';

      routeLayerRef.current = L.polyline(latlngs, {
        color: routeColor,
        weight: isUltraMode ? 6 : 8,
        opacity: 0.95,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(mapInstanceRef.current);

      // Fit bounds if previewing route
      if (activeRoute.coordinates.length > 0 && !positionState.speed) {
        mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
          padding: [60, 60],
          maxZoom: 16,
        });
      }
    }
  }, [activeRoute, positionState.isSensorAssisted, isUltraMode]);

  // Render Vehicle Indicator & Sensor Uncertainty Radius
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const lat = currentPosition.lat;
    const lng = currentPosition.lng;

    // Vehicle Marker
    const markerColor = positionState.isSensorAssisted ? '#00e5ff' : '#ff4800';
    const vehicleHtml = `
      <div class="vehicle-marker-wrapper" style="transform: rotate(${positionState.heading}deg);">
        <div class="vehicle-pulse-ring" style="border-color: ${markerColor}; background: ${markerColor}25;"></div>
        <div style="
          width: 28px;
          height: 28px;
          background: ${markerColor};
          border: 3px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 18px ${markerColor};
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#ffffff" stroke="#ffffff" stroke-width="2">
            <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
          </svg>
        </div>
      </div>
    `;

    const vehicleIcon = L.divIcon({
      html: vehicleHtml,
      className: 'vehicle-nav-icon',
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });

    if (!vehicleMarkerRef.current) {
      vehicleMarkerRef.current = L.marker([lat, lng], { icon: vehicleIcon }).addTo(mapInstanceRef.current);
    } else {
      vehicleMarkerRef.current.setLatLng([lat, lng]);
      vehicleMarkerRef.current.setIcon(vehicleIcon);
    }

    // Accuracy Circle
    if (!accuracyCircleRef.current) {
      accuracyCircleRef.current = L.circle([lat, lng], {
        radius: positionState.accuracyMeters,
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.12,
        weight: 1,
      }).addTo(mapInstanceRef.current);
    } else {
      accuracyCircleRef.current.setLatLng([lat, lng]);
      accuracyCircleRef.current.setRadius(positionState.accuracyMeters);
      accuracyCircleRef.current.setStyle({
        color: markerColor,
        fillColor: markerColor,
      });
    }

    // Pan with vehicle during active driving
    if (positionState.speed > 0) {
      mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.8 });
    }
  }, [currentPosition, positionState]);

  return (
    <div className="relative w-full h-full min-h-[380px]">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
