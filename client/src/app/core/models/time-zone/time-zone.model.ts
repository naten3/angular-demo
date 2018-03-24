export interface TimeZone {
  id: number;
  positiveOffset: boolean;
  offsetHours: number;
  offsetMinutes: number;
  cityName: string;
  timeZoneName: string;
}

export interface UserTimeZones {
  userId?: number;
  timeZones: Array<TimeZone>;
}
