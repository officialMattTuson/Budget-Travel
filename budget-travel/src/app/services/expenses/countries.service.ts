import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private readonly countriesApiUrl = 'https://restcountries.com/v3.1/all';
  private readonly citiesApiUrl =
    'https://countriesnow.space/api/v0.1/countries/cities';

  constructor(private readonly http: HttpClient) {}

  getCountries(): Observable<object[]> {
    return this.http.get<object[]>(this.countriesApiUrl);
  }

  getCitiesByCountry(countryName: string): Observable<string[]> {
    return this.http
      .post<{ data: string[] }>(this.citiesApiUrl, { country: countryName })
      .pipe(map((res) => res.data));
  }
}
