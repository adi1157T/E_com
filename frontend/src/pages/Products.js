import React, { useState, useEffect } from 'react'
import API from '../api/index'
import { useNavigate } from 'react-router-dom'

function Products() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [search, category, sort, minPrice, maxPrice, products])

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products')
      setProducts(res.data)
      setFiltered(res.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load products')
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...products]

    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'All') {
      result = result.filter(p => p.category === category)
    }

    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice))
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice))
    }

    if (sort === 'low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === 'high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFiltered(result)
  }

  const categories = ['All', ...new Set(products.map(p => p.category))]

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

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="price-input"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="price-input"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="filter-select">
          <option value="default">Sort by</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <p className="results-count">{filtered.length} products found</p>

      <div className="products-grid">
        {filtered.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          filtered.map(product => (
            <div key={product._id} className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
              <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">₹{product.price}</p>
              <p className="product-stock">Stock: {product.stock}</p>
              <button onClick={(e) => { e.stopPropagation(); addToCart(product._id) }}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Products