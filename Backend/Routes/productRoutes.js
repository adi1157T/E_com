const express = require('express')
const router = express.Router()
const { getProducts, addProduct, getProductById, updateProduct, deleteProduct } = require('../Controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', getProducts)
router.post('/', authMiddleware, addProduct)
router.get('/:id', getProductById)
router.put('/:id', authMiddleware, updateProduct)
router.delete('/:id', authMiddleware, deleteProduct)

module.exports = router