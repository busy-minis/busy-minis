export interface Ride {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  pickupDate: string;
  status: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  riders: Passenger[];
}

export interface Passenger {
  name: string;
  age: number;
}
