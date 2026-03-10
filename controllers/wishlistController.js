import User from "../models/User.js";
import Product from "../models/Product.js";

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const idx = user.wishlist.indexOf(productId);
    
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      await user.save();
      return res.json({ message: 'Removed from wishlist', wishlisted: false });
    }
    
    user.wishlist.push(productId);
    await user.save();
    res.json({ message: 'Added to wishlist', wishlisted: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
