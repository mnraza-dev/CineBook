import mongoose, { Schema } from 'mongoose';
const movieSchema = new Schema({
  _id: { type: String, required: true }, title: { type: String, required: true }, overview: { type: String, default: '' },
  poster_path: { type: String, default: '' }, backdrop_path: { type: String, default: '' },
  genres: [{ id: Number, name: String }], casts: [{ name: String, profile_path: String }],
  release_date: String, original_language: { type: String, default: 'en' }, tagline: String,
  vote_average: { type: Number, default: 0 }, runtime: { type: Number, required: true }, trailerUrl: String,
}, { timestamps: true });
const showSchema = new Schema({
  movie: { type: String, ref: 'Movie', required: true }, showDateTime: { type: Date, required: true },
  showPrice: { type: Number, required: true }, currency: { type: String, default: 'inr' },
  archived: { type: Boolean, default: false },
  reservations: { type: Map, of: String, default: {} },
}, { timestamps: true });
showSchema.index({ movie: 1, showDateTime: 1 }, { unique: true, partialFilterExpression: { archived: false } });
const bookingSchema = new Schema({
  userId: { type: String, required: true, index: true }, show: { type: Schema.Types.ObjectId, ref: 'Show', required: true },
  bookedSeats: [String], amount: { type: Number, required: true }, currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled', 'expired'], default: 'pending' },
  expiresAt: Date, checkoutSessionId: String, checkoutUrl: String,
}, { timestamps: true });
bookingSchema.index({ checkoutSessionId: 1 }, { unique: true, sparse: true });
const userSchema = new Schema({ _id: String, favorites: { type: [String], default: [] } }, { timestamps: true });
export const Movie = mongoose.model('Movie', movieSchema);
export const Show = mongoose.model('Show', showSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
export const User = mongoose.model('User', userSchema);
