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
