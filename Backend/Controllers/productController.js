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

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json({ message: 'Product updated', product })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}



module.exports = { getProducts, addProduct, getProductById, updateProduct, deleteProduct  }