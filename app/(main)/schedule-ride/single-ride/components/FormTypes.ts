// app/single-ride/types/formTypes.ts

export interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

export interface Rider {
  name: string;
  age: string;
}

export interface FormData {
  user_id: string;
  status: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
  stops: Stop[];
  distance: number;
  isSameDay?: boolean;
  isOffPeak?: boolean;
  isWithinOneHour?: boolean;
}
