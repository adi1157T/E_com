import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/index'

function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart')
      setCart(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`)
      fetchCart()
    } catch (err) {
      setMessage('Failed to remove item')
    }
  }

  const placeOrder = async () => {
    try {
      await API.post('/orders')
      setMessage('Order placed successfully!')
      setTimeout(() => navigate('/orders'), 2000)
    } catch (err) {
      setMessage('Failed to place order')
    }
  }

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  if (loading) return <div className="loading">Loading cart...</div>
  if (!cart || cart.items.length === 0) return <div className="empty-cart"><h2>Your cart is empty</h2></div>

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {message && <p className="success-msg">{message}</p>}
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.product.image || 'https://via.placeholder.com/100'} alt={item.product.name} />
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p>₹{item.product.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: ₹{item.product.price * item.quantity}</p>
              </div>
              <button onClick={() => removeItem(item.product._id)} className="remove-btn">Remove</button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <p>Total: ₹{calculateTotal()}</p>
          <button onClick={placeOrder} className="checkout-btn">Place Order</button>
        </div>
      </div>
    </div>
  )
}

export default Cart