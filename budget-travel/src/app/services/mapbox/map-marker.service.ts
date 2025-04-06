import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MapSetupService } from './map-setup.service';

@Injectable({ providedIn: 'root' })
export class MapMarkerService {
  private markers: mapboxgl.Marker[] = [];

  constructor(private readonly mapService: MapSetupService) {}

  addMarker(lat: number, lng: number, label?: string): mapboxgl.Marker | null {
    const map = this.mapService.getMapSnapshot();
    if (!map) return null;

    const popup = label ? new mapboxgl.Popup().setText(label) : undefined;

    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);
    this.markers.push(marker);
    return marker;
  }

  addMarkers(points: { lat: number; lng: number; label?: string }[]): void {
    const map = this.mapService.getMapSnapshot();
    if (!map) return;

    points.forEach(({ lat, lng, label }) => this.addMarker(lat, lng, label));
  }

  clearMarkers(): void {
    this.markers.forEach((m) => m.remove());
    this.markers = [];
  }
}
