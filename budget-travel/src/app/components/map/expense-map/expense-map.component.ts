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
import { Location } from '../../../models/location.model';
import { take } from 'rxjs';
import { MapMarkerService } from '../../../services/mapbox/map-marker.service';
import { AlertService } from '../../../services/shared/alert.service';

@Component({
  selector: 'app-expense-map',
  templateUrl: './expense-map.component.html',
  styleUrl: './expense-map.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class ExpenseMapComponent implements AfterViewInit, OnDestroy {
  @Input() mapHeight: string = '500px';
  @Input() mapWidth: string = '750px';
  @Input() pins: { lat: number; lng: number; label?: string }[] = [];
  @Input() enableClickToAdd: boolean = false;
  @Output() locationPinAdded = new EventEmitter<Location>();

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly mapboxSetupService: MapSetupService,
    private readonly mapboxMarkerService: MapMarkerService,
    private readonly locationService: LocationService,
    private readonly alertService: AlertService
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    mapboxgl.accessToken = environment.mapboxToken;

    const map = this.mapboxSetupService.initializeMap('map');

    map.on('load', () => {
      this.loadPins();
    });

    if (this.enableClickToAdd) {
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        this.mapboxMarkerService.clearMarkers();
        this.mapboxMarkerService.addMarker(lat, lng);
        this.getLocationByCoordinates(lat, lng);
      });
    }
  }

  getLocationByCoordinates(lat: number, lng: number): void {
    this.locationService
      .reverseGeocode(lat, lng)
      .pipe(take(1))
      .subscribe({
        next: (location: Location) => {
          this.locationPinAdded.emit(location);
        },
        error: (error) => this.alertService.error(error),
      });
  }

  loadPins(): void {
    this.mapboxMarkerService.addMarkers(this.pins);
  }

  ngOnDestroy(): void {
    this.mapboxSetupService.destroyMap();
  }
}
