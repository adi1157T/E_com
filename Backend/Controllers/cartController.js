const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId
    const { productId, quantity } = req.body
    
    let cart = await Cart.findOne({ user: userId })
    if (cart){
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
        if(itemIndex>-1){
            cart.items[itemIndex].quantity += quantity
        }
        else{
            cart.items.push({ product: productId, quantity })
        }
        await cart.save()
    }
    else{
        cart = new Cart({
            user: userId,
            items: [{ product: productId, quantity }]
        })
        
        await cart.save()
    }
    res.status(200).json({ message: 'Cart updated', cart })
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}


const getCart = async (req, res) => {
  try {
    const userId = req.user.userId  
    const cart = await Cart.findOne({ user: userId }).populate('items.product')
    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' })
    }
    res.status(200).json( cart )
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId
    const { productId } = req.params

    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' })
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId)
    await cart.save()

    res.status(200).json({ message: 'Item removed', cart })
  }
  catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { addToCart, getCart, removeFromCart }