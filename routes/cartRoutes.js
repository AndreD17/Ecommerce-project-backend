import express from "express";
import { fetchUser, addToCart, removeFromCart, getCart } from "../controllers/cartController.js";

const router = express.Router();

router.use(fetchUser);

router.post("/addtocart", addToCart);
router.post("/removefromcart", removeFromCart);
router.get("/getcart", getCart);

export default router;
