const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


const placeOrder = async (req, res) => {
    try{
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.product.price * item.quantity;
        }); 
        const order = new Order({
            user: userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalAmount
        });
        await order.save()
        cart.items = []
        await cart.save()
        res.status(201).json({ message: 'Order placed successfully', order });
            
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId
    const orders = await Order.find({ user: userId }).populate('items.product')
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.product')
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    res.status(200).json({ message: 'Order status updated', order })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus }
