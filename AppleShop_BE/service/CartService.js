const cartModel = require('../model/CartModel');

const get = async () => {
    const carts = await cartModel.find({}).populate('productId', '_id name price image');
    return carts;
}

const create = async (cartData) => {
    const newCart = new cartModel(cartData);
    await newCart.save();
    return newCart;
};

const remove = async (cartId) => {
    const result = await cartModel.deleteOne({ _id: cartId });
    return result.deletedCount > 0;
};
  



module.exports = {get, create, remove};