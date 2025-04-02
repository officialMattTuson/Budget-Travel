import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';

enum MapStyles {
  MapboxStreets = 'mapbox://styles/mapbox/streets-v12',
  MapboxOutdoors = 'mapbox://styles/mapbox/outdoors-v12',
  MapboxLight = 'mapbox://styles/mapbox/light-v11',
  MapboxDark = 'mapbox://styles/mapbox/dark-v11',
  MapboxSatellite = 'mapbox://styles/mapbox/satellite-v9',
  MapboxSatelliteStreets = 'mapbox://styles/mapbox/satellite-streets-v12',
  MapboxNavigationDay = 'mapbox://styles/mapbox/navigation-day-v1',
  MapboxNavigationNight = 'mapbox://styles/mapbox/navigation-night-v',
}

@Injectable({
  providedIn: 'root',
})
export class MapSetupService {
  initializeMap(
    containerId: string,
    options?: Partial<mapboxgl.MapboxOptions>
  ): mapboxgl.Map {
    const map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 2,
      ...options,
    });

    return map;
  }

  addMarker(
    map: mapboxgl.Map,
    lat: number,
    lng: number,
    label?: string
  ): mapboxgl.Marker {
    const popup = label ? new mapboxgl.Popup().setText(label) : undefined;

    return new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);
  }

  addMarkers(
    map: mapboxgl.Map,
    points: { lat: number; lng: number; label?: string }[]
  ): void {
    points.forEach(({ lat, lng, label }) =>
      this.addMarker(map, lat, lng, label)
    );
  }

  // onMapClick(callback: (coords: { lat: number; lng: number }) => void): void {
  //   this.map.on('click', (e) => {
  //     const { lat, lng } = e.lngLat;
  //     callback({ lat, lng });
  //   });
  // }
}
