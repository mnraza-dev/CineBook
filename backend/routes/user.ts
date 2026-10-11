import { z } from "zod";
import { Router } from 'express';
import { Movie, User } from '../models/index.js';
import { HttpError } from '../services/booking.js';
export const userRoutes = Router();
userRoutes.get('/favorites', async (_req, res) => {
  const user = await User.findById(res.locals.userId);
  res.json(await Movie.find({ _id: { $in: user?.favorites || [] } }));
});
userRoutes.put('/favorites/:movieId', async (req, res) => {
  const { favorite } = z.object({ favorite: z.boolean() }).parse(req.body);
  if (!await Movie.exists({ _id: req.params.movieId })) throw new HttpError(404, 'Movie not found');
  await User.updateOne({ _id: res.locals.userId }, favorite
    ? { $addToSet: { favorites: req.params.movieId } }
    : { $pull: { favorites: req.params.movieId } }, { upsert: true });
  res.json({ favorite: favorite });
});
