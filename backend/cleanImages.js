import mongoose from "mongoose";
import Service from "./models/Service.js";
import Spa from "./models/Spa.js";

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/tonDB");

    await Service.updateMany({}, { $set: { images: [] } });
    await Spa.updateMany({}, { $set: { images: [] } });

    console.log("✅ Images supprimées avec succès");

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

run();