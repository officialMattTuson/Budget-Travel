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
  standalone: true,
  imports: [CommonModule],
})
export class ExpenseMapComponent implements AfterViewInit, OnDestroy {
  @Input() mapHeight: string = '500px';
  @Input() mapWidth: string = '750px';
  @Input() pins: { lat: number; lng: number; label?: string }[] = [];
  @Input() enableClickToAdd: boolean = false;
  @Output() pinAdded = new EventEmitter<{ lat: number; lng: number }>();

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly mapboxSetupService: MapSetupService,
    private readonly locationService: LocationService
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

        this.mapboxSetupService.addMarker(lat, lng);
        this.pinAdded.emit({ lat, lng });

        this.locationService.reverseGeocode(lat, lng).subscribe((location) => {
          console.log(location);
        });
      });
    }
  }

  private loadPins(): void {
    this.mapboxSetupService.addMarkers(this.pins);
  }

  ngOnDestroy(): void {
    this.mapboxSetupService.destroyMap();
  }
}
