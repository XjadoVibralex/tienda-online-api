const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const cartController = require('../controller/cartController');

router.post('/add', protect, cartController.addItemToCart);
router.post('/apply-coupon', protect, cartController.applyCoupon);
router.get('/', protect, cartController.getCart);
router.delete('/remove/:productId', protect, cartController.removeItemFromCart);
router.delete('/clear', protect, cartController.clearCart);
router.post('/migrate', protect, cartController.migrateCart);

module.exports = router;