import React, { useState, useEffect } from 'react'
import API from '../api/index'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my')
      setOrders(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading orders...</div>
  if (orders.length === 0) return <div><h2>No orders yet</h2></div>

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <p>Order ID: {order._id}</p>
            <p className={`order-status ${order.status}`}>{order.status}</p>
          </div>
          <div className="order-items">
            {order.items.map(item => (
              <div key={item._id} className="order-item">
                <p>{item.product?.name}</p>
                <p>Qty: {item.quantity}</p>
              </div>
            ))}
          </div>
          <p className="order-total">Total: ₹{order.totalAmount}</p>
        </div>
      ))}
    </div>
  )
}

export default Orders