import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { Movie, Show } from './models/index.js';
import { seedMovies } from './seed-data.js';
try {
  await connectDB();
  await Promise.all([Movie.init(), Show.init()]);
  for (const movie of seedMovies) await Movie.updateOne({ _id: movie._id }, { $setOnInsert: movie }, { upsert: true });
  const date = new Date(); date.setUTCDate(date.getUTCDate() + 2); date.setUTCHours(13, 0, 0, 0);
  for (const movie of seedMovies) await Show.updateOne({ movie: movie._id, showDateTime: date, archived: false }, { $setOnInsert: { showPrice: 250, currency: process.env.PAYMENT_CURRENCY || 'inr', reservations: {} } }, { upsert: true });
  console.log('Sample movies and future shows seeded. Existing records were preserved.');
} finally { await mongoose.disconnect(); }
