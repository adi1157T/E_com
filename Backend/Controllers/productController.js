const Product = require('../models/productModel')

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body
    const product = await Product.create({ name, description, price, image, category, stock })
    res.status(201).json({ message: 'Product added', product })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { getProducts, addProduct }