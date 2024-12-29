const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const { protect, admin } = require('../middlewares/auth');

router.post('/create', protect, orderController.createOrder);
router.get('/', protect, admin, orderController.getAllOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);
router.delete('/:id', protect, admin, orderController.deleteOrder);

module.exports = router;