import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';

enum MapStyles {
  MapboxStreets = 'mapbox://styles/mapbox/streets-v12',
  MapboxOutdoors = 'mapbox://styles/mapbox/outdoors-v12',
  MapboxLight = 'mapbox://styles/mapbox/light-v11',
  MapboxDark = 'mapbox://styles/mapbox/dark-v11',
  MapboxSatellite = 'mapbox://styles/mapbox/satellite-v9',
  MapboxSatelliteStreets = 'mapbox://styles/mapbox/satellite-streets-v12',
  MapboxNavigationDay = 'mapbox://styles/mapbox/navigation-day-v1',
  MapboxNavigationNight = 'mapbox://styles/mapbox/navigation-night-v1',
}

@Injectable({ providedIn: 'root' })
export class MapSetupService {
  private readonly map$ = new BehaviorSubject<mapboxgl.Map | null>(null);

  setMap(map: mapboxgl.Map): void {
    this.map$.next(map);
  }

  getMap$(): Observable<mapboxgl.Map | null> {
    return this.map$.asObservable();
  }

  getMapSnapshot(): mapboxgl.Map | null {
    return this.map$.getValue();
  }

  initializeMap(
    containerId: string,
    options?: Partial<mapboxgl.MapboxOptions>
  ): mapboxgl.Map {
    const map = new mapboxgl.Map({
      container: containerId,
      style: MapStyles.MapboxSatelliteStreets,
      center: [175.2528, -37.7826],
      zoom: 7,
      ...options,
    });

    this.setMap(map);
    return map;
  }

  destroyMap(): void {
    const map = this.getMapSnapshot();
    if (map) map.remove();
    this.map$.next(null);
  }
}
