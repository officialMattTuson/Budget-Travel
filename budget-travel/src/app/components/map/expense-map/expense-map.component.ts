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
import { MapSetupService } from '../../../services/mapbox/map-setup.service';
import { LocationService } from '../../../services/mapbox/location.service';

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

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly mapboxSetupService: MapSetupService,
    private readonly locationService: LocationService
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    mapboxgl.accessToken = environment.mapboxToken;
    this.map = this.mapboxSetupService.initializeMap('map');
    this.map.on('load', () => this.loadPins());

    if (this.enableClickToAdd) {
      this.map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        this.addMarker(lat, lng);
        this.pinAdded.emit({ lat, lng });
        this.locationService
          .reverseGeocode(lat, lng)
          .subscribe((locationData) => {
            console.log(locationData);
            // Optional: patch your form or emit this info
          });
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
