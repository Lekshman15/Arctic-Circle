require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const ticketRoutes = require("./routes/ticket.routes");
const salesRoutes = require("./routes/sales.routes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/sales", salesRoutes);

// Express 5 forwards rejected promises from async handlers to error
// middleware automatically, so controllers don't need try/catch wrappers
// for unexpected errors — expected failures are still handled inline.
app.use((req, res) => res.status(404).json({ error: "Not found." }));
app.use(errorHandler);

module.exports = app;
