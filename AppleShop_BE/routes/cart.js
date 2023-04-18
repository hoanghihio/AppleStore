var express = require('express');
var router = express.Router();
const cartController = require('../controller/CartController');

  
router.post('/add', cartController.addProductToCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:productId', cartController.deleteFromCart);

// Lấy thông tin giỏ hàng của người dùng
router.get('/', cartController.getCart);


module.exports = router;