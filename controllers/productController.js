import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const query = { isActive: true };

    if (req.query.category) query.category = req.query.category;
    if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    let sort = '-createdAt';
    if (req.query.sort === 'price_asc') sort = 'price';
    else if (req.query.sort === 'price_desc') sort = '-price';
    else if (req.query.sort === 'rating') sort = '-rating';

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({ success: true, products, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    if (req.body.existingImages) {
      const existing = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
      images.push(...existing);
    }
    const specs = req.body.specKeys
      ? req.body.specKeys.map((k, i) => ({ key: k, value: req.body.specValues?.[i] || '' }))
      : [];
    const product = await Product.create({ ...req.body, images, specifications: specs });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      updateData.images = [...(req.body.existingImages || []), ...newImages];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Already reviewed' });
    product.reviews.push({ user: req.user._id, name: req.user.name, ...req.body });
    product.calculateRating();
    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
