import type Stripe from "stripe";
import { Booking, Show } from '../models/index.js';
import { stripeClient, reconcile } from './payments.js';
import { HttpError } from './booking.js';
export async function createCheckout(booking: InstanceType<typeof Booking>, stripe: Stripe = stripeClient()) {
  const show = await Show.findById(booking.show).populate('movie');
  if (!show) throw new HttpError(404, 'Show not found');
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', payment_method_types: ['card'],
    client_reference_id: String(booking._id), metadata: { bookingId: String(booking._id) },
    expires_at: Math.floor(booking.createdAt.getTime() / 1000) + 32 * 60,
    line_items: [{ price_data: { currency: booking.currency, unit_amount: booking.amount / booking.bookedSeats.length,
      product_data: { name: `Cinema booking · ${booking.bookedSeats.join(', ')}` } }, quantity: booking.bookedSeats.length }],
    success_url: `${clientUrl}/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/my-bookings?checkout=cancelled`,
  }, { idempotencyKey: `booking-${booking._id}` });
  await Booking.updateOne({ _id: booking._id }, { $set: { checkoutSessionId: session.id, checkoutUrl: session.url } });
  await reconcile(session);
  return session;
}
