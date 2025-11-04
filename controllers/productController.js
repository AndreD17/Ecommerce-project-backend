import Product from "../models/Product.js";


export const addProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 0;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}, "-_id id name image category new_price old_price available");
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove product
export const removeProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true, message: "Product removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// New collections
export const newCollections = async (req, res) => {
  const products = await Product.find({});
  res.json(products.slice(-8));
};

// Popular in women
export const popularInWomen = async (req, res) => {
  const products = await Product.find({ category: "women" });
  res.json(products.slice(0, 4));
};
