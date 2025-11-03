import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();
const PORT = process.env.PORT;

// __dirname & __filename for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://ecommerce-project-yofl.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// Serve frontend build
app.use("/", express.static(path.join(__dirname, "../frontend/build")));


// Serve admin build
app.use("/admin", express.static(path.join(__dirname, "../admin/build")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes (no /api prefix)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);


// SPA fallback for frontend (any route that is not /api or /admin)
app.get(/^\/(?!api|admin).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// SPA fallback for admin: any route starting with /admin but not /api
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/build/index.html'));
});




// Test route
app.get("/", (req, res) => res.send("Ecommerce API is running 🚀"));

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
