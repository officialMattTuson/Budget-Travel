import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MapSetupService } from './map-setup.service';

@Injectable({ providedIn: 'root' })
export class MapControlsService {
  constructor(private readonly mapService: MapSetupService) {}

  setZoom(zoom: number) {
    this.mapService.getMapSnapshot()?.setZoom(zoom);
  }

  flyTo(lat: number, lng: number, zoom: number = 14) {
    this.mapService.getMapSnapshot()?.flyTo({ center: [lng, lat], zoom });
  }

  fitBounds(coords: [number, number][]) {
    const bounds = new mapboxgl.LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
    this.mapService.getMapSnapshot()?.fitBounds(bounds, { padding: 40 });
  }

  setPitch(pitch: number) {
    this.mapService.getMapSnapshot()?.setPitch(pitch);
  }

  setBearing(bearing: number) {
    this.mapService.getMapSnapshot()?.setBearing(bearing);
  }
}