export interface Ride {
  id: string;
  distance: number;
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

export interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

export interface WeeklyFormData {
  renewal_date: string;
  user_id: string;
  status: string;
  end_date: string;
  pickupDate: string;
  pickupAddress: string;
  pickupLat?: number;
  distance: number;
  pickupLng?: number;
  stops: Stop[];
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
  selectedTime: string;
  selectedDays: string[];
  total_cost: number;
  payment_status: string;
  payment_intent_id: string;
}
