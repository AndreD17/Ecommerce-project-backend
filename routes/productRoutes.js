import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/images"); 
    },
  filename: (req, file, cb) => {
    cb(null, `product_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// ✅ Upload route
router.post("/upload", upload.single("product"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Dynamically detect backend URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Full image URL
    const imageUrl = `${baseUrl}/images/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully ✅",
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
});

export default router;
