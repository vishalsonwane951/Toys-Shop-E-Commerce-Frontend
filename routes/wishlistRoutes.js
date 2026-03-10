const router = require('express').Router();
const ctrl = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, ctrl.getWishlist);
router.put('/:productId', protect, ctrl.toggleWishlist);

module.exports = router;
