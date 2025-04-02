import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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

@Component({
  selector: 'app-expense-map',
  templateUrl: './expense-map.component.html',
  styleUrl: './expense-map.component.scss',
  imports: [CommonModule],
})
export class ExpenseMapComponent implements AfterViewInit, OnDestroy {
  @Input() pins: { lat: number; lng: number; label?: string }[] = [];
  @Input() enableClickToAdd: boolean = false;
  @Output() pinAdded = new EventEmitter<{ lat: number; lng: number }>();

  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    mapboxgl.accessToken = environment.mapboxToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: MapStyles.MapboxSatelliteStreets,
      projection: 'globe',
      center: [175.2528, -37.7826],
      zoom: 7,
    });

    this.map.on('load', () => this.loadPins());

    if (this.enableClickToAdd) {
      this.map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        this.addMarker(lat, lng);
        this.pinAdded.emit({ lat, lng });
      });
    }
  }

  private loadPins(): void {
    this.pins.forEach((pin) => {
      this.addMarker(pin.lat, pin.lng, pin.label);
    });
  }

  private addMarker(lat: number, lng: number, label?: string): void {
    const popup = label ? new mapboxgl.Popup().setText(label) : undefined;
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.map);
    this.markers.push(marker);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
