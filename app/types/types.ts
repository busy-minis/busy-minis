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

export interface Rider {
  name: string;
  age: string;
}

export interface FormData {
  user_id: string;
  status: string;
  pickupDate: string;
  selectedTime: string;
  selectedDays: string[];
  pickupAddress: string;
  end_date: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
}
