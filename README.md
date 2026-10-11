# CineBook

Cinema booking prototype using React + TypeScript, Vite, Tailwind CSS v4,
shadcn/ui components, Three.js, and a Node.js + Express + TypeScript backend.

## Development

Use Node.js 22.12+ and pnpm 10. Install dependencies in each app:

```sh
cd client
pnpm install
cp .env.example .env
pnpm dev
```

Set `VITE_CLERK_PUBLISHABLE_KEY` to your Clerk publishable key before starting
or building the frontend. `VITE_CURRENCY` controls the displayed currency.
The home page uses Three.js for a decorative particle scene, with reduced-motion
support and a background-image fallback when WebGL is unavailable.
shadcn/ui Button and Input components live in `client/src/components/ui` and are
used throughout the existing screens. Aliases and `components.json` support
adding further components with the shadcn CLI.

In a second terminal:

```sh
cd backend
pnpm install
cp .env.example .env
pnpm dev
```

Set `MONGO_URI` to your MongoDB connection string. The backend connects to MongoDB
before listening on `PORT` (default 8000). `GET /api/health` reports server health.

## Validation and production

Frontend: `pnpm typecheck`, `pnpm lint`, `pnpm build`.
Backend: `pnpm typecheck`, `pnpm build`, then `pnpm start`.

Both apps use strict TypeScript. Production backend output is in `backend/dist`;
frontend output is in `client/dist`.

## Current scope

The stack migration preserves the existing prototype. Movies, showtimes,
favorites, bookings and admin statistics still use fixtures. Booking persistence,
payment processing, real show-management APIs and admin authorization remain
unfinished. The empty user model/route files are placeholders.
