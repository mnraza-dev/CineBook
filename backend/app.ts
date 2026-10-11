import type Stripe from "stripe";
import express, { type RequestHandler, type ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { clerkMiddleware, getAuth } from '@clerk/express';
import mongoose from 'mongoose';
import { z, ZodError } from 'zod';
import { Movie, Show, Booking, User } from './models/index.js';
import { HttpError, reserve, release } from './services/booking.js';
import { stripeClient, reconcile } from './services/payments.js';
import { createCheckout } from './services/checkout.js';
import { userRoutes } from './routes/user.js';

const movieInput = z.object({
  title: z.string().trim().min(1).max(200), overview: z.string().max(5000).default(''),
  poster_path: z.url(), backdrop_path: z.url().optional(), runtime: z.number().int().min(1).max(600),
  original_language: z.string().min(2).max(10).default('en'), release_date: z.string().optional(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })).default([]),
  casts: z.array(z.object({ name: z.string(), profile_path: z.string() })).default([]),
  vote_average: z.number().min(0).max(10).default(0), tagline: z.string().default(''),
  trailerUrl: z.url().refine(url => ['www.youtube.com', 'youtube.com', 'youtu.be'].includes(new URL(url).hostname), 'Use a YouTube trailer URL').optional(),
});
const showInput = z.object({ movieId: z.string().min(1), showDateTime: z.iso.datetime({ offset: true }),
  showPrice: z.number().positive().max(100000).refine(n => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001, 'Use at most two decimal places') });
const authenticate: RequestHandler = async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) return next(new HttpError(401, 'Sign in to continue'));
  res.locals.userId = userId;
  await User.updateOne({ _id: userId }, { $setOnInsert: { favorites: [] } }, { upsert: true });
  next();
};
export function createApp(auth: RequestHandler = authenticate, clerk: RequestHandler = clerkMiddleware({ authorizedParties: [process.env.CLIENT_URL || "http://localhost:5173"] }), payments: () => Stripe = stripeClient) {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
  app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.get('stripe-signature');
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) throw new HttpError(400, 'Missing webhook signature or configuration');
    let event;
    try { event = payments().webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET); }
    catch { throw new HttpError(400, 'Invalid webhook signature'); }
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.expired') await reconcile(event.data.object);
    res.json({ received: true });
  });
  app.use(express.json({ limit: '100kb' }));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false, handler: (_req, res) => { res.status(429).json({ error: 'Too many requests. Please wait a minute and retry.' }); } }));
  app.use('/api', clerk);
  app.get('/api/movies', async (_req, res) => {
    const ids = await Show.distinct('movie', { archived: false, showDateTime: { $gt: new Date() } });
    res.json(await Movie.find({ _id: { $in: ids } }).sort({ title: 1 }));
  });
  app.get('/api/movies/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) throw new HttpError(404, 'Movie not found');
    const shows = await Show.find({ movie: movie._id, archived: false, showDateTime: { $gt: new Date() } }).sort({ showDateTime: 1 });
    const dateTime: Record<string, unknown[]> = {};
    for (const show of shows) {
      const date = show.showDateTime.toLocaleDateString('en-CA', { timeZone: process.env.CINEMA_TIMEZONE || 'Asia/Kolkata' });
      (dateTime[date] ||= []).push({ time: show.showDateTime.toISOString(), showId: String(show._id), showPrice: show.showPrice, currency: show.currency });
    }
    res.json({ movie, dateTime });
  });
  app.get('/api/shows/:id/seats', async (req, res) => {
    const show = await Show.findById(req.params.id);
    if (!show || show.archived) throw new HttpError(404, 'Show not found');
    res.json({ occupiedSeats: [...show.reservations.keys()], showPrice: show.showPrice, currency: show.currency });
  });
  app.use('/api/user', auth, userRoutes);
  app.get('/api/me', auth, (_req, res) => res.json({ userId: res.locals.userId, isAdmin: (process.env.ADMIN_USER_IDS || '').split(',').map(s => s.trim()).includes(res.locals.userId) }));
  app.get('/api/bookings', auth, async (_req, res) => {
    const bookings = await Booking.find({ userId: res.locals.userId }).populate({ path: 'show', populate: { path: 'movie' } }).sort({ createdAt: -1 });
    res.json(bookings);
  });
  app.post('/api/bookings', auth, async (req, res) => {
    payments(); // Avoid reserving seats when payment credentials are missing.
    const input = z.object({ showId: z.string(), seats: z.array(z.string()) }).parse(req.body);
    const booking = await reserve(res.locals.userId, input.showId, input.seats);
    try {
      const session = await createCheckout(booking, payments());
      res.status(201).json({ bookingId: booking._id, url: session.url });
    } catch (error) {
      // On transport errors Stripe may already have created the session. Retain the hold for recovery.
      if (error instanceof Error && error.constructor.name === 'StripeInvalidRequestError') await release(String(booking._id), 'cancelled');
      if (!(error instanceof HttpError)) {
        console.error('Checkout creation failed', error);
        throw new HttpError(502, 'Checkout could not be confirmed. Check My Bookings to resume or cancel your reservation.');
      }
      throw error;
    }
  });
  app.post('/api/bookings/:id/checkout', auth, async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, userId: res.locals.userId });
    if (!booking) throw new HttpError(404, 'Booking not found');
    if (booking.status !== 'pending') throw new HttpError(409, 'Booking is no longer pending');
    const session = booking.checkoutSessionId ? await payments().checkout.sessions.retrieve(booking.checkoutSessionId) : await createCheckout(booking, payments());
    await reconcile(session);
    if (session.status !== 'open') throw new HttpError(409, 'Checkout has completed or expired. Refresh your bookings.');
    res.json({ url: session.url });
  });
  app.post('/api/bookings/:id/sync', auth, async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, userId: res.locals.userId });
    if (!booking) throw new HttpError(404, 'Booking not found');
    if (booking.status === 'pending' && booking.checkoutSessionId) await reconcile(await payments().checkout.sessions.retrieve(booking.checkoutSessionId));
    res.json({ ok: true });
  });
  app.post('/api/bookings/:id/cancel', auth, async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, userId: res.locals.userId });
    if (!booking) throw new HttpError(404, 'Booking not found');
    if (booking.status !== 'pending') throw new HttpError(409, 'Only unpaid bookings can be cancelled');
    const stripe = payments();
    const session = booking.checkoutSessionId ? await stripe.checkout.sessions.retrieve(booking.checkoutSessionId) : await createCheckout(booking, payments());
    const finalSession = session.status === 'open' ? await stripe.checkout.sessions.expire(session.id) : session;
    if (finalSession.status === 'expired') await release(String(booking._id), 'cancelled');
    else {
      await reconcile(finalSession);
      throw new HttpError(409, 'Payment has completed or is processing. Refresh the booking status.');
    }
    res.json({ ok: true });
  });
  app.use('/api/admin', auth, (_req, res, next) => {
    if (!(process.env.ADMIN_USER_IDS || '').split(',').map(s => s.trim()).includes(res.locals.userId)) return next(new HttpError(403, 'Administrator access required'));
    next();
  });
  app.get('/api/admin/movies', async (_req, res) => res.json(await Movie.find().sort({ title: 1 })));
  app.post('/api/admin/movies', async (req, res) => res.status(201).json(await Movie.create({ _id: new mongoose.Types.ObjectId().toString(), ...movieInput.parse(req.body) })));
  app.post('/api/admin/shows', async (req, res) => {
    const input = showInput.parse(req.body);
    if (new Date(input.showDateTime).getTime() < Date.now() + 60 * 60_000) throw new HttpError(400, 'Schedule shows at least one hour ahead');
    if (!await Movie.exists({ _id: input.movieId })) throw new HttpError(404, 'Movie not found');
    res.status(201).json(await Show.create({ movie: input.movieId, showDateTime: input.showDateTime, showPrice: input.showPrice, currency: process.env.PAYMENT_CURRENCY || 'inr' }));
  });
  app.get('/api/admin/shows', async (_req, res) => res.json(await Show.find({ archived: false }).populate('movie').sort({ showDateTime: -1 })));
  app.delete('/api/admin/shows/:id', async (req, res) => {
    await mongoose.connection.transaction(async session => {
      const show = await Show.findById(req.params.id).session(session);
      if (!show || show.archived) throw new HttpError(404, 'Show not found');
      if (show.reservations.size) throw new HttpError(409, 'Cannot remove a show with reserved or paid seats');
      show.archived = true;
      await show.save({ session });
    });
    res.json({ ok: true });
  });
  app.get('/api/admin/bookings', async (_req, res) => res.json(await Booking.find().populate({ path: 'show', populate: { path: 'movie' } }).sort({ createdAt: -1 })));
  app.get('/api/admin/dashboard', async (_req, res) => {
    const [paid, totalUser, activeShows] = await Promise.all([Booking.find({ status: 'paid' }), User.countDocuments(), Show.find({ archived: false, showDateTime: { $gt: new Date() } }).populate('movie')]);
    res.json({ totalBookings: paid.length, totalRevenue: paid.reduce((n, b) => n + b.amount, 0) / 100, totalUser, activeShows });
  });
  app.use((_req, _res, next) => next(new HttpError(404, 'Endpoint not found')));
  const errors: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof ZodError) return void res.status(400).json({ error: error.issues.map(i => i.message).join('; ') });
    if (error instanceof mongoose.Error.CastError) return void res.status(400).json({ error: 'Invalid identifier' });
    if (error?.code === 11000) return void res.status(409).json({ error: 'This record already exists' });
    const status = error instanceof HttpError ? error.status : error?.status === 400 ? 400 : 500;
    if (status === 500) console.error(error);
    res.status(status).json({ error: status === 500 ? 'Unable to complete request. Please try again.' : error.message });
  };
  app.use(errors);
  return app;
}
