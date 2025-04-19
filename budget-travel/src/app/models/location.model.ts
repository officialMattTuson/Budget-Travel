export interface Location {
  name: string;
  address?: string;
  city?: string;
  country: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CoordinatesWithZoom {
  lat: number;
  lng: number;
  zoom: number;
}

export interface Pin {
  lat: number;
  lng: number;
  label?: string;
}
