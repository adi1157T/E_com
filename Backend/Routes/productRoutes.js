const express = require('express')
const router = express.Router()
const {getProducts, addProduct} = require('../Controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/products', getProducts)
router.post('/products', authMiddleware, addProduct)
module.exports = router