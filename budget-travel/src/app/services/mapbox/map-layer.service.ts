import { Injectable } from '@angular/core';
import { MapSetupService } from './map-setup.service';

@Injectable({ providedIn: 'root' })
export class MapLayerService {
  constructor(private readonly mapService: MapSetupService) {}

  addGeoJsonLayer(id: string, data: any, paint: any, layout: any = {}) {
    const map = this.mapService.getMapSnapshot();
    if (!map || map.getSource(id)) return;

    map.addSource(id, { type: 'geojson', data });
    map.addLayer({ id, type: 'fill', source: id, paint, layout });
  }

  removeLayer(id: string) {
    const map = this.mapService.getMapSnapshot();
    if (!map?.getLayer(id)) return;
    map.removeLayer(id);
    map.removeSource(id);
  }

  toggleLayerVisibility(id: string, visible: boolean) {
    const map = this.mapService.getMapSnapshot();
    if (!map?.getLayer(id)) return;
    map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
  }
}