import expres from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = expres();
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
