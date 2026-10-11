import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./config/db.js";

async function start(): Promise<void> {
  const port = Number(process.env.PORT || 8000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  await connectDB();
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}
start().catch((error: unknown) => {
  console.error("Server startup failed:", error);
  process.exitCode = 1;
});
