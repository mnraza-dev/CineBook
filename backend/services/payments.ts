import Stripe from 'stripe';
import { Booking } from '../models/index.js';
import { HttpError, release } from './booking.js';
export function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) throw new HttpError(503, 'Checkout is not configured yet');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}
export async function reconcile(session: Stripe.Checkout.Session) {
  const booking = await Booking.findOne({ checkoutSessionId: session.id });
  if (!booking) return;
  if (session.payment_status === 'paid') {
    if (session.amount_total !== booking.amount || session.currency !== booking.currency || session.metadata?.bookingId !== String(booking._id)) {
      throw new Error('Payment does not match booking');
    }
    // Seat holds remain until Stripe has authoritatively completed or expired the session.
    await Booking.updateOne({ _id: booking._id, status: 'pending' }, { $set: { status: 'paid' } });
  } else if (session.status === 'expired') await release(String(booking._id), 'expired');
}
export async function recoverPending(payments: () => Stripe = stripeClient) {
  const pending = await Booking.find({ status: 'pending', expiresAt: { $lt: new Date() } });
  for (const booking of pending) {
    try {
      if (booking.checkoutSessionId) await reconcile(await payments().checkout.sessions.retrieve(booking.checkoutSessionId));
      else {
        // Find a session created before a crash that prevented saving its ID.
        const sessions = payments().checkout.sessions.list({ created: { gte: Math.floor(booking.createdAt.getTime() / 1000) - 1, lte: Math.floor(booking.createdAt.getTime() / 1000) + 32 * 60 }, limit: 100 });
        let recovered = false;
        for await (const checkout of sessions) {
          if (checkout.client_reference_id === String(booking._id)) {
            await Booking.updateOne({ _id: booking._id }, { $set: { checkoutSessionId: checkout.id, checkoutUrl: checkout.url } });
            await reconcile(checkout);
            recovered = true;
            break;
          }
        }
        if (!recovered) await release(String(booking._id), 'expired');
      }
    } catch (error) { console.error('Booking reconciliation failed', String(booking._id), error); }
  }
}
