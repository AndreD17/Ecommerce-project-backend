import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
