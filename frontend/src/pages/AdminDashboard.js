import React, { useState, useEffect } from 'react'
import API from '../api/index'

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: '', stock: '', image: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/all')
      setOrders(res.data)
    } catch (err) {}
  }

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products')
      setProducts(res.data)
    } catch (err) {}
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      await API.post('/products', newProduct)
      setMessage('Product added successfully')
      fetchProducts()
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image: '' })
    } catch (err) {
      setMessage('Failed to add product')
    }
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-section">
        <h2>Add New Product</h2>
        {message && <p className="success-msg">{message}</p>}
        <form onSubmit={handleAddProduct} className="admin-form">
          <input placeholder="Product Name" value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
          <input placeholder="Description" value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
          <input placeholder="Price" type="number" value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
          <input placeholder="Category" value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
          <input placeholder="Stock" type="number" value={newProduct.stock}
            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} />
          <input placeholder="Image URL" value={newProduct.image}
            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} />
          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className="admin-section">
        <h2>All Products ({products.length})</h2>
        <div className="admin-products">
          {products.map(product => (
            <div key={product._id} className="admin-product-card">
              <p>{product.name}</p>
              <p>₹{product.price}</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2>All Orders ({orders.length})</h2>
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <p>User: {order.user?.name}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <p>Status: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard