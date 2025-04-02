import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly baseUrl =
    'https://api.mapbox.com/geocoding/v5/mapbox.places';
  constructor(private readonly http: HttpClient) {}

  reverseGeocode(lat: number, lng: number): Observable<any> {
    const url = `${this.baseUrl}/${lng},${lat}.json?access_token=${environment.mapboxToken}`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const feature = res.features[0];
        const context = feature.context || [];

        return {
          name: feature.text,
          address: feature.place_name,
          city: context.find((c: any) => c.id.includes('place'))?.text || '',
          country:
            context.find((c: any) => c.id.includes('country'))?.text || '',
          coordinates: { lat, lng },
        };
      })
    );
  }
}
