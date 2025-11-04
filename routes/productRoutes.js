import express from "express";
import {
  addProduct,
  getAllProducts,
  removeProduct,
  newCollections,
  popularInWomen
} from "../controllers/productController.js";

import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) =>
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// ✅ Upload route with dynamic base URL detection
router.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, message: "No file uploaded" });

  // ✅ Automatically detect correct domain (Render, local, etc.)
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/images/${req.file.filename}`;

  console.log("✅ Uploaded Image URL:", imageUrl);

  res.json({
    success: true,
    image_url: imageUrl
  });
});


router.post("/addproduct", addProduct);
router.get("/allproducts", getAllProducts);
router.post("/removeproduct", removeProduct);
router.get("/newcollections", newCollections);
router.get("/popularinwomen", popularInWomen);

export default router;
