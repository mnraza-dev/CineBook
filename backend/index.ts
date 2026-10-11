import "dotenv/config";
import { createApp } from "./app.js";
import connectDB from "./config/db.js";

async function start(): Promise<void> {
  const port = Number(process.env.PORT || 8000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  await connectDB();
  if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) throw new Error("Clerk keys are required");
  const { recoverPending } = await import("./services/payments.js");
  let reconciling = false;
  const recover = async () => {
    if (reconciling) return;
    reconciling = true;
    try { await recoverPending(); } finally { reconciling = false; }
  };
  void recover().catch(console.error);
  setInterval(() => { void recover().catch(console.error); }, 60_000).unref();
  const { Movie, Show, Booking, User } = await import("./models/index.js");
  await Promise.all([Movie.init(), Show.init(), Booking.init(), User.init()]);
  const app = createApp();
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}
start().catch((error: unknown) => {
  console.error("Server startup failed:", error);
  process.exitCode = 1;
});
