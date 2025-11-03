import User from "../models/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
export const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
 
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  const itemId = Number(req.body.itemId);
  const user = await User.findById(req.user.id);

  if (!user.cartData[itemId]) user.cartData[itemId] = 0;
  user.cartData[itemId] += 1;

  await User.findByIdAndUpdate(req.user.id, { cartData: user.cartData });
  res.json({ success: true, message: "Item added to cart" });
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  const itemId = Number(req.body.itemId);
  const user = await User.findById(req.user.id);

  if (user.cartData[itemId] > 0) user.cartData[itemId] -= 1;

  await User.findByIdAndUpdate(req.user.id, { cartData: user.cartData });
  res.json({ success: true, message: "Item removed from cart" });
};

// Get cart
export const getCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.cartData);
};
