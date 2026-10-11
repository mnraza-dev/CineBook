# CineBook

Movie booking app using React + strict TypeScript, Vite, Tailwind CSS v4,
shadcn/ui and Three.js. The Node.js + Express + TypeScript API persists data in
MongoDB, verifies Clerk sessions and accepts payments through Stripe Checkout.

## Features

- Live upcoming movie catalog, title/genre search, detail pages and trailer links.
- Persisted favorites per signed-in customer.
- Showtimes grouped in the configured cinema timezone and live seat availability.
- Transactional reservations for up to five seats, with server-calculated prices.
- Stripe card checkout, signed payment webhooks, payment resumption, status refresh,
  and cancellation of unpaid reservations. Confirmed bookings keep their seats.
- Customer booking history and booking references for cinema admission.
- Protected admin dashboard, movie creation, show scheduling, show removal when
  there are no reserved seats, and booking/revenue reports.
- Automatic reconciliation of expired/abandoned checkout and recovery of sessions
  created immediately before a server crash. Payment transport failures retain
  seats until Stripe's status is known, preventing double booking.
- Responsive admin navigation, loading/error/retry states and Three.js decoration
  with reduced-motion support and a WebGL fallback.

## Requirements

Node.js 22.12+ and pnpm 10. MongoDB **must support transactions**: use MongoDB
Atlas or a local replica set, not a standalone server. You also need a Clerk
application and Stripe test keys for local checkout testing.

## Setup

Install each app's dependencies and copy its environment example:

```sh
cd backend
pnpm install
cp .env.example .env
```

Configure `backend/.env`:

- `MONGO_URI`: Atlas or replica-set connection URI.
- `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`: keys from the same Clerk app.
- `ADMIN_USER_IDS`: comma-separated Clerk user IDs with administrator access.
  This is a server-only allowlist; customers cannot promote themselves.
- `CLIENT_URL`: exact frontend origin, locally `http://localhost:5173`.
- `STRIPE_SECRET_KEY`: Stripe test secret key during development.
- `STRIPE_WEBHOOK_SECRET`: signing secret for your webhook endpoint.
- `PAYMENT_CURRENCY`: three-letter Stripe currency code, default `inr`.
- `CINEMA_TIMEZONE`: IANA timezone, default `Asia/Kolkata`.

Start the backend:

```sh
pnpm dev
```

In another terminal:

```sh
cd client
pnpm install
cp .env.example .env
pnpm dev
```

Set `VITE_CLERK_PUBLISHABLE_KEY` to your Clerk publishable key.
`VITE_API_URL=/api` uses Vite's development proxy to port 8000. For deployments
with separate origins, set it to the backend's full `/api` URL and set the
backend's `CLIENT_URL` to the deployed frontend origin. Set
`VITE_PAYMENT_CURRENCY` to match `PAYMENT_CURRENCY` and `VITE_CURRENCY` to its
symbol. Backend responses carry currency codes for checkout and booking amounts.

The database starts empty. Sign in as an allowlisted administrator, open
`/admin/add-shows`, add a movie and schedule a future show. Alternatively,
`pnpm seed` in `backend` intentionally populates sample movie records and future
shows without replacing existing records. Sample content is never used as a
frontend fallback.

### Stripe webhooks

Forward Stripe test events to the backend while developing:

```sh
stripe listen --forward-to localhost:8000/api/payments/webhook
```

Copy the printed signing secret into `STRIPE_WEBHOOK_SECRET` and restart the
backend. In production register the HTTPS endpoint
`/api/payments/webhook` for `checkout.session.completed` and
`checkout.session.expired`. Only card payments are enabled. Do not point test
webhooks at a live deployment or mix Stripe account environments.

A checkout lasts approximately 32 minutes. A background job checks overdue
pending bookings every minute; it releases seats only after verifying expiration
with Stripe. Pending reservations remain held during Stripe outages. A successful
browser redirect alone never marks a booking paid. Customers can refresh payment
status from booking history if webhook delivery is delayed.

## Checks

```sh
cd client
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

```sh
cd backend
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

Integration tests use an isolated temporary MongoDB replica set and download a
MongoDB binary on first use. They exercise real database transactions and HTTP
routes. Stripe network methods are replaced in checkout-flow tests; webhook
signature tests use Stripe's actual signing and verification implementation.
No real users or charges are created by the suite. Real Clerk sign-in and Stripe
test checkout still need validation using your configured accounts.

## Deployment

Build `client/dist` with the frontend's real publishable key and API URL. Serve it
with SPA fallback to `index.html`. Build the backend and run `pnpm start` with its
server-only environment variables and a reachable MongoDB replica set. Configure
Stripe webhooks and the Clerk application's permitted frontend domain. Keep the
backend process running so overdue reservations are reconciled. Do not expose
Clerk or Stripe secret keys in any `VITE_` variable.

Paid booking cancellations/refunds and multi-cinema management are not provided;
customers can cancel only unpaid reservations. No deployment or live account
configuration is performed by this repository change.
