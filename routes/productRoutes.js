import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import s3 from "../config/digitalOcean.js";
import {
  addProduct,
  getAllProducts,
  removeProduct,
  newCollections,
  popularInWomen
} from "../controllers/productController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Upload product image to DigitalOcean Spaces
router.post("/upload", upload.single("product"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileContent = fs.readFileSync(req.file.path);

    const params = {
      Bucket: process.env.DO_SPACE_BUCKET,
      Key: `products/${Date.now()}_${path.basename(req.file.originalname)}`,
      Body: fileContent,
      ACL: "public-read",
      ContentType: req.file.mimetype,
    };

    const data = await s3.upload(params).promise();

    fs.unlinkSync(req.file.path);

    console.log("✅ Uploaded Image URL:", data.Location);

    return res.json({
      success: true,
      image_url: data.Location,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
});

router.post("/addproduct", addProduct);
router.get("/allproducts", getAllProducts);
router.post("/removeproduct", removeProduct);
router.get("/newcollections", newCollections);
router.get("/popularinwomen", popularInWomen);

export default router;
