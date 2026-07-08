import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/hotel");

    console.log("✅ DB is connected");
  } catch (error) {
    console.log("❌ DB connection error:", error);
  }
}

connectDB();
