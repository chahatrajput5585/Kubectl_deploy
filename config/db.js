const path = require("path");
const mongoose = require("mongoose");
// require("dotenv").config(); // loads .env
require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("✅ MongoDB connected");
});

db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

db.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});
