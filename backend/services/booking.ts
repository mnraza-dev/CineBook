import mongoose from 'mongoose';
import { Booking, Show } from '../models/index.js';
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function validateSeats(seats: string[]): void {
  if (!seats.length || seats.length > 5 || new Set(seats).size !== seats.length || seats.some(s => !/^[A-J][1-9]$/.test(s))) {
    throw new HttpError(400, 'Select between one and five unique seats from A1–J9');
  }
}
export async function reserve(userId: string, showId: string, seats: string[]) {
  validateSeats(seats);
  return mongoose.connection.transaction(async session => {
    const show = await Show.findById(showId).session(session);
    if (!show || show.archived || show.showDateTime <= new Date()) throw new HttpError(404, 'This show is no longer available');
    if (seats.some(s => show.reservations?.has(s))) throw new HttpError(409, 'One or more seats were just reserved. Choose different seats.');
    const [booking] = await Booking.create([{
      userId, show: show._id, bookedSeats: seats, amount: Math.round(show.showPrice * 100) * seats.length,
      currency: show.currency, expiresAt: new Date(Date.now() + 35 * 60_000),
    }], { session });
    seats.forEach(s => show.reservations.set(s, String(booking._id)));
    await show.save({ session });
    return booking;
  });
}
export async function release(bookingId: string, status: 'cancelled' | 'expired') {
  return mongoose.connection.transaction(async session => {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking || booking.status !== 'pending') return;
    const show = await Show.findById(booking.show).session(session);
    for (const seat of booking.bookedSeats) {
      if (show?.reservations.get(seat) === bookingId) show.reservations.delete(seat);
    }
    if (show) await show.save({ session });
    booking.status = status;
    await booking.save({ session });
  });
}
