import type { dummyShowsData, dummyDateTimeData, dummyBookingData } from "./assets/assets";
export type Movie = typeof dummyShowsData[number];
export type ShowTime = typeof dummyDateTimeData[string][number];
export type MovieShow = { movie: Movie; dateTime: Record<string, ShowTime[]> };
export type Booking = typeof dummyBookingData[number];
