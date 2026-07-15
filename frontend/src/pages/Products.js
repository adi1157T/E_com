import React, { useState, useEffect } from 'react'
import API from '../api/index'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products')
      setProducts(res.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load products')
      setLoading(false)
    }
  }

  const addToCart = async (productId) => {
    try {
      await API.post('/cart/add', { productId, quantity: 1 })
      setMessage('Added to cart!')
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('Please login to add to cart')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  if (loading) return <div className="loading">Loading products...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="products-container">
      <h1>All Products</h1>
      {message && <p className="success-msg">{message}</p>}
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-price">₹{product.price}</p>
            <p className="product-stock">Stock: {product.stock}</p>
            <button onClick={() => addToCart(product._id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products