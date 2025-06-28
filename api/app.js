import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import usersRouter from "./routes/users.js";
import stationsRouter from "./routes/stations.js";

const app = express(); // ✅ Declare first, then export
const origin = import.meta.env.VITE_FRONTEND_URL

// Allow requests from any client
// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// docs: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors({
  origin: origin,
  credentials: true,
}));

// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());

// API Routes
app.use("/users", usersRouter);
app.use("/stations", stationsRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

export default app;
