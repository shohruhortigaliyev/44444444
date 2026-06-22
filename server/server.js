require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/tests");
const resultRoutes = require("./routes/results");
const userRoutes = require("./routes/users");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
});

app.set("io", io);

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/users", userRoutes);

app.get("/api/ping", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error("MONGO_URI not set in env");
  process.exit(1);
}

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log("Server listening on port", PORT);
    });
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
  });

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});
