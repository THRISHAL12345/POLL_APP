import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import pollsRouter from "./routes/polls.js";

dotenv.config(); // Load .env variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
// Make io accessible in routes (optional)
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/polls", pollsRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo connection error:", err));

// Simple test route
app.get("/", (req, res) => {
  res.send("Poll API is running");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("joinPoll", (pollId) => socket.join(pollId));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
