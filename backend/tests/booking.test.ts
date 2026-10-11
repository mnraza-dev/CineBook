import { before, after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import request from 'supertest';
import Stripe from 'stripe';
import type { RequestHandler } from 'express';
import { createApp } from '../app.js';
import { Movie, Show, Booking, User } from '../models/index.js';
import { HttpError, reserve, release } from '../services/booking.js';
import { reconcile } from '../services/payments.js';
let mongo: MongoMemoryReplSet;
const auth: RequestHandler = (req, res, next) => {
  const user = req.get('x-test-user');
  if (!user) return next(new HttpError(401, 'Sign in to continue'));
  res.locals.userId = user; next();
};
const app = createApp(auth, (_req, _res, next) => next());
let showId: string;
before(async () => {
  process.env.ADMIN_USER_IDS = 'admin';
  process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 }, binary: { version: '7.0.24' } });
  await mongoose.connect(mongo.getUri());
  await Promise.all([Movie.init(), Show.init(), Booking.init(), User.init()]);
});
after(async () => { await mongoose.disconnect(); await mongo?.stop(); });
beforeEach(async () => {
  await Promise.all([Movie.deleteMany({}), Show.deleteMany({}), Booking.deleteMany({}), User.deleteMany({})]);
  await Movie.create({ _id: 'movie1', title: 'Test Movie', runtime: 120, poster_path: 'https://example.com/poster.jpg' });
  const show = await Show.create({ movie: 'movie1', showDateTime: new Date(Date.now() + 86400000), showPrice: 250.25, currency: 'inr' });
  showId = String(show._id);
});
test('catalog returns persisted movies and showtime prices without private reservation owners', async () => {
  const movies = await request(app).get('/api/movies').expect(200);
  assert.equal(movies.body[0].title, 'Test Movie');
  const detail = await request(app).get('/api/movies/movie1').expect(200);
  const times = Object.values(detail.body.dateTime).flat() as { showId: string; showPrice: number }[];
  assert.equal(times[0].showId, showId); assert.equal(times[0].showPrice, 250.25);
  await reserve('alice', showId, ['A1']);
  const seats = await request(app).get(`/api/shows/${showId}/seats`).expect(200);
  assert.deepEqual(seats.body.occupiedSeats, ['A1']); assert.equal(JSON.stringify(seats.body).includes('alice'), false);
});
test('authentication and server-side administrator authorization are required', async () => {
  await request(app).get('/api/bookings').expect(401);
  await request(app).get('/api/admin/movies').set('x-test-user', 'alice').expect(403);
  await request(app).get('/api/admin/movies').set('x-test-user', 'admin').expect(200);
});
test('favorites persist and repeated PUT requests are idempotent', async () => {
  for (let i = 0; i < 2; i++) await request(app).put('/api/user/favorites/movie1').set('x-test-user', 'alice').send({ favorite: true }).expect(200);
  let response = await request(app).get('/api/user/favorites').set('x-test-user', 'alice').expect(200);
  assert.equal(response.body.length, 1);
  await request(app).put('/api/user/favorites/movie1').set('x-test-user', 'alice').send({ favorite: false }).expect(200);
  response = await request(app).get('/api/user/favorites').set('x-test-user', 'alice').expect(200);
  assert.equal(response.body.length, 0);
});
test('concurrent overlapping seat requests produce exactly one successful booking', async () => {
  const results = await Promise.allSettled([reserve('alice', showId, ['A1', 'A2']), reserve('bob', showId, ['A2', 'A3'])]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  const failure = results.find(r => r.status === 'rejected') as PromiseRejectedResult;
  assert.equal(failure.reason.status, 409);
  assert.equal(await Booking.countDocuments(), 1);
  assert.equal((await Show.findById(showId))?.reservations.size, 2);
});
test('seat validation rejects duplicates, invalid seats, empty selections and more than five', async () => {
  for (const seats of [[], ['A1', 'A1'], ['Z1'], ['A10'], ['A1', 'A2', 'A3', 'A4', 'A5', 'A6']]) {
    await assert.rejects(reserve('alice', showId, seats), (error: unknown) => error instanceof HttpError && error.status === 400);
  }
  assert.equal(await Booking.countDocuments(), 0);
});
test('reservation uses server price and releasing seats is idempotent', async () => {
  const booking = await reserve('alice', showId, ['B1', 'B2']);
  assert.equal(booking.amount, 50050);
  await release(String(booking._id), 'expired'); await release(String(booking._id), 'expired');
  assert.equal((await Show.findById(showId))?.reservations.size, 0);
  assert.equal((await Booking.findById(booking._id))?.status, 'expired');
  await reserve('bob', showId, ['B1']);
});
function paidSession(id: string, amount: number): Stripe.Checkout.Session {
  return { id: 'cs_test_booking', status: 'complete', payment_status: 'paid', amount_total: amount, currency: 'inr', metadata: { bookingId: id } } as unknown as Stripe.Checkout.Session;
}
test('payment reconciliation verifies amounts and is idempotent; paid seats cannot be released', async () => {
  const booking = await reserve('alice', showId, ['C1']);
  booking.checkoutSessionId = 'cs_test_booking'; await booking.save();
  await assert.rejects(reconcile(paidSession(String(booking._id), 1)), /does not match/);
  assert.equal((await Booking.findById(booking._id))?.status, 'pending');
  await reconcile(paidSession(String(booking._id), 25025));
  await reconcile(paidSession(String(booking._id), 25025));
  await release(String(booking._id), 'expired');
  assert.equal((await Booking.findById(booking._id))?.status, 'paid');
  assert.equal((await Show.findById(showId))?.reservations.size, 1);
});
test('webhook rejects forged signatures and accepts signed Stripe payment confirmation', async () => {
  await request(app).post('/api/payments/webhook').send({ type: 'checkout.session.completed' }).expect(400);
  const booking = await reserve('alice', showId, ['D1']);
  booking.checkoutSessionId = 'cs_test_booking'; await booking.save();
  const payload = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed', data: { object: paidSession(String(booking._id), 25025) } });
  const stripe = new Stripe('sk_test_fake');
  const signature = stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_test' });
  await request(app).post('/api/payments/webhook').set('Content-Type', 'application/json').set('stripe-signature', signature).send(payload).expect(200);
  assert.equal((await Booking.findById(booking._id))?.status, 'paid');
});
test('booking history and actions cannot access another customer’s bookings', async () => {
  const booking = await reserve('alice', showId, ['E1']);
  const own = await request(app).get('/api/bookings').set('x-test-user', 'alice').expect(200);
  assert.equal(own.body.length, 1); assert.equal(own.body[0].show.movie.title, 'Test Movie');
  const other = await request(app).get('/api/bookings').set('x-test-user', 'bob').expect(200);
  assert.equal(other.body.length, 0);
  for (const action of ['sync', 'cancel', 'checkout']) await request(app).post(`/api/bookings/${booking._id}/${action}`).set('x-test-user', 'bob').expect(404);
});
test('admin scheduling validates price and dates, and cannot delete reserved shows', async () => {
  await request(app).post('/api/admin/shows').set('x-test-user', 'admin').send({ movieId: 'movie1', showPrice: -1, showDateTime: new Date().toISOString() }).expect(400);
  await request(app).post('/api/admin/shows').set('x-test-user', 'admin').send({ movieId: 'movie1', showPrice: 100, showDateTime: new Date().toISOString() }).expect(400);
  await reserve('alice', showId, ['F1']);
  await request(app).delete(`/api/admin/shows/${showId}`).set('x-test-user', 'admin').expect(409);
});
test('dashboard revenue counts only verified paid bookings', async () => {
  const booking = await reserve('alice', showId, ['G1']);
  booking.checkoutSessionId = 'cs_test_booking'; await booking.save();
  await reserve('bob', showId, ['G2']);
  await reconcile(paidSession(String(booking._id), 25025));
  const response = await request(app).get('/api/admin/dashboard').set('x-test-user', 'admin').expect(200);
  assert.equal(response.body.totalBookings, 1); assert.equal(response.body.totalRevenue, 250.25);
});
test('invalid identifiers and expired shows return useful errors', async () => {
  await request(app).get('/api/shows/not-an-id/seats').expect(400);
  await Show.updateOne({ _id: showId }, { showDateTime: new Date(Date.now() - 1000) });
  await assert.rejects(reserve('alice', showId, ['A1']), (e: unknown) => e instanceof HttpError && e.status === 404);
});

test('checkout API uses server prices, resumes payment and cancels without keeping seat holds', async () => {
  const { mock } = await import('node:test');
  const gateway = new Stripe('sk_test_fake');
  let checkout: Stripe.Checkout.Session;
  mock.method(gateway.checkout.sessions, 'create', async (input: Stripe.Checkout.SessionCreateParams, options: Stripe.RequestOptions) => {
    assert.equal(options.idempotencyKey, `booking-${input.metadata?.bookingId}`);
    assert.deepEqual(input.payment_method_types, ['card']);
    assert.ok(input.expires_at! >= Math.floor(Date.now() / 1000) + 30 * 60);
    assert.equal(input.line_items?.[0].price_data?.unit_amount, 25025);
    assert.equal(input.line_items?.[0].quantity, 2);
    checkout = { id: 'cs_test_flow', status: 'open', payment_status: 'unpaid', currency: 'inr', amount_total: 50050,
      url: 'https://checkout.stripe.com/test', metadata: input.metadata } as unknown as Stripe.Checkout.Session;
    return checkout;
  });
  mock.method(gateway.checkout.sessions, 'retrieve', async () => checkout);
  mock.method(gateway.checkout.sessions, 'expire', async () => { checkout.status = 'expired'; return checkout; });
  const checkoutApp = createApp(auth, (_req, _res, next) => next(), () => gateway);
  const response = await request(checkoutApp).post('/api/bookings').set('x-test-user', 'alice').send({ showId, seats: ['H1', 'H2'], amount: 1 }).expect(201);
  assert.equal(response.body.url, 'https://checkout.stripe.com/test');
  const booking = await Booking.findById(response.body.bookingId);
  assert.equal(booking?.amount, 50050);
  await request(checkoutApp).post('/api/bookings').set('x-test-user', 'bob').send({ showId, seats: ['H1'] }).expect(409);
  await request(checkoutApp).post(`/api/bookings/${response.body.bookingId}/checkout`).set('x-test-user', 'alice').expect(200);
  await request(checkoutApp).post(`/api/bookings/${response.body.bookingId}/cancel`).set('x-test-user', 'alice').expect(200);
  assert.equal((await Booking.findById(booking?._id))?.status, 'cancelled');
  assert.equal((await Show.findById(showId))?.reservations.size, 0);
});
test('payment sync confirms paid checkout and cancellation cannot release confirmed seats', async () => {
  const { mock } = await import('node:test');
  const gateway = new Stripe('sk_test_fake');
  const booking = await reserve('alice', showId, ['I1']);
  booking.checkoutSessionId = 'cs_test_booking'; await booking.save();
  mock.method(gateway.checkout.sessions, 'retrieve', async () => paidSession(String(booking._id), 25025));
  const checkoutApp = createApp(auth, (_req, _res, next) => next(), () => gateway);
  await request(checkoutApp).post(`/api/bookings/${booking._id}/sync`).set('x-test-user', 'alice').expect(200);
  await request(checkoutApp).post(`/api/bookings/${booking._id}/cancel`).set('x-test-user', 'alice').expect(409);
  assert.equal((await Show.findById(showId))?.reservations.get('I1'), String(booking._id));
});
test('unconfigured checkout never reserves seats', async () => {
  const checkoutApp = createApp(auth, (_req, _res, next) => next(), () => { throw new HttpError(503, 'Checkout is not configured yet'); });
  await request(checkoutApp).post('/api/bookings').set('x-test-user', 'alice').send({ showId, seats: ['A1'] }).expect(503);
  assert.equal(await Booking.countDocuments(), 0);
  assert.equal((await Show.findById(showId))?.reservations.size, 0);
});
test('signed expiry webhook releases unpaid seat reservations', async () => {
  const booking = await reserve('alice', showId, ['J1']);
  booking.checkoutSessionId = 'cs_test_expired'; await booking.save();
  const payload = JSON.stringify({ id: 'evt_expired', type: 'checkout.session.expired', data: { object: { id: 'cs_test_expired', status: 'expired', payment_status: 'unpaid' } } });
  const signature = new Stripe('sk_test_fake').webhooks.generateTestHeaderString({ payload, secret: 'whsec_test' });
  await request(app).post('/api/payments/webhook').set('Content-Type', 'application/json').set('stripe-signature', signature).send(payload).expect(200);
  assert.equal((await Booking.findById(booking._id))?.status, 'expired');
  assert.equal((await Show.findById(showId))?.reservations.size, 0);
});

test('removing an empty show preserves cancelled booking history and prevents new reservations', async () => {
  const booking = await reserve('alice', showId, ['A1']);
  await release(String(booking._id), 'cancelled');
  await request(app).delete(`/api/admin/shows/${showId}`).set('x-test-user', 'admin').expect(200);
  const history = await request(app).get('/api/bookings').set('x-test-user', 'alice').expect(200);
  assert.equal(history.body[0].show.movie.title, 'Test Movie');
  assert.equal((await request(app).get('/api/movies').expect(200)).body.length, 0);
  await assert.rejects(reserve('bob', showId, ['A1']), (e: unknown) => e instanceof HttpError && e.status === 404);
});
test('overdue checkout reconciliation releases expired holds and recovers sessions lost during a crash', async () => {
  const { mock } = await import('node:test');
  const { recoverPending } = await import('../services/payments.js');
  const gateway = new Stripe('sk_test_fake');
  const expired = await reserve('alice', showId, ['B1']);
  expired.checkoutSessionId = 'cs_expired'; expired.expiresAt = new Date(Date.now() - 1000); await expired.save();
  const recovered = await reserve('bob', showId, ['B2']);
  recovered.expiresAt = new Date(Date.now() - 1000); await recovered.save();
  mock.method(gateway.checkout.sessions, 'retrieve', async () => ({ id: 'cs_expired', status: 'expired', payment_status: 'unpaid' }));
  mock.method(gateway.checkout.sessions, 'list', () => ({
    async *[Symbol.asyncIterator]() {
      yield { ...paidSession(String(recovered._id), 25025), client_reference_id: String(recovered._id), url: null };
    },
  }));
  await recoverPending(() => gateway);
  assert.equal((await Booking.findById(expired._id))?.status, 'expired');
  assert.equal((await Booking.findById(recovered._id))?.status, 'paid');
  const show = await Show.findById(showId);
  assert.equal(show?.reservations.has('B1'), false);
  assert.equal(show?.reservations.get('B2'), String(recovered._id));
});
