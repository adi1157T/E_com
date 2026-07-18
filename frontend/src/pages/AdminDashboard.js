import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/index'

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: '', stock: '', image: ''
  })
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('products')
  const navigate = useNavigate()

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
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to add product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      setMessage('Product deleted')
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to delete product')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product })
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    try {
      await API.put(`/products/${editingProduct._id}`, editingProduct)
      setMessage('Product updated')
      setEditingProduct(null)
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to update product')
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status })
      setMessage('Order status updated')
      fetchOrders()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to update order')
    }
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      {message && <p className="success-msg">{message}</p>}

      <div className="admin-tabs">
        <button
          className={activeTab === 'products' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('products')}
        >Products ({products.length})</button>
        <button
          className={activeTab === 'orders' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('orders')}
        >Orders ({orders.length})</button>
        <button
          className={activeTab === 'add' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('add')}
        >Add Product</button>
      </div>

      {activeTab === 'add' && (
        <div className="admin-section">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct} className="admin-form">
            <input placeholder="Product Name" value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
            <input placeholder="Description" value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} required />
            <input placeholder="Price" type="number" value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
            <input placeholder="Category" value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required />
            <input placeholder="Stock" type="number" value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
            <input placeholder="Image URL" value={newProduct.image}
              onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} />
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-section">
          <h2>All Products</h2>
          {editingProduct && (
            <div className="edit-modal">
              <h3>Edit Product</h3>
              <form onSubmit={handleUpdateProduct} className="admin-form">
                <input value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
                <input value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
                <input type="number" value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} />
                <input value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} />
                <input type="number" value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})} />
                <input value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} />
                <div style={{display:'flex', gap:'12px'}}>
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
          <div className="admin-products-table">
            {products.map(product => (
              <div key={product._id} className="admin-product-row">
                <img src={product.image || 'https://via.placeholder.com/60'} alt={product.name} />
                <div className="admin-product-info">
                  <p className="admin-product-name">{product.name}</p>
                  <p>₹{product.price} | Stock: {product.stock} | {product.category}</p>
                </div>
                <div className="admin-product-actions">
                  <button className="edit-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-section">
          <h2>All Orders</h2>
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p>User: {order.user?.name || 'Unknown'}</p>
                <p>Total: ₹{order.totalAmount}</p>
              </div>
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item._id} className="order-item">
                    <p>{item.product?.name}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="order-status-update">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                  className="filter-select"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard