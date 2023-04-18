const cartService = require('../service/CartService');

const addProductToCart = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const quantity = req.body.quantity;
  
      const result = await cartService.addProductToCart(productId, quantity);
  
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }




module.exports = {addProductToCart};