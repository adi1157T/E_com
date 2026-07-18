import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/index'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`)
      setProduct(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    try {
      await API.post('/cart/add', { productId: id, quantity })
      setMessage('Added to cart!')
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('Please login first')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!product) return <div className="loading">Product not found</div>

  return (
    <div className="product-detail-container">
      <button className="back-btn" onClick={() => navigate('/products')}>← Back</button>
      <div className="product-detail-layout">
        <div className="product-detail-image">
          <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-category">{product.category}</p>
          <p className="product-detail-price">₹{product.price}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-stock">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          {message && <p className="success-msg">{message}</p>}
          <div className="quantity-selector">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
          </div>
          <div className="product-detail-buttons">
            <button className="add-cart-btn" onClick={addToCart} disabled={product.stock === 0}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail