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
const PORT = process.env.PORT || 4000;

// ✅ Define __dirname properly for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://ecommerce-project-admin-uuwx.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "DELETE"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/images", express.static(path.join(__dirname, "upload/images")));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// ✅ Test route
app.get("/", (req, res) => res.send("Ecommerce API is running 🚀🚀🚀🚀"));

// ✅ Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}...`));
