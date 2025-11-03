import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already in use" });

    let cart = {};
    for (let i = 0; i <= 300; i++) cart[i] = 0;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET);
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ success: false, message: "Invalid email" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET);
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
