import "dotenv/config";
import mongoose from "mongoose";
import http from "http";

import app from "./app.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 5000;

// ================= CONNECT DATABASE =================
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    mongoose.set("strictPopulate", false);
    console.log("MongoDB connected");

    const server = http.createServer(app);

    // ================= SOCKET.IO =================
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
    process.exit(1);
  }
}

startServer();