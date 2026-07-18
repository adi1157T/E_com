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

  const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const handlePayment = async () => {
  try {
    const loaded = await loadRazorpay()
    if (!loaded) {
      setMessage('Razorpay failed to load')
      return
    }

    const total = calculateTotal()
    const res = await API.post('/payment/create-order', { amount: total })

    const options = {
      key: res.data.keyId,
      amount: res.data.amount,
      currency: res.data.currency,
      name: 'BuyHard',
      description: 'Purchase',
      order_id: res.data.orderId,
      handler: async (response) => {
        try {
          await API.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
          await API.post('/orders')
          setMessage('Payment successful! Order placed.')
          setTimeout(() => navigate('/orders'), 2000)
        } catch (err) {
          setMessage('Payment verification failed')
        }
      },
      prefill: {
        name: 'Customer',
        email: 'customer@example.com'
      },
      theme: {
        color: '#7C3AED'
      }
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  } catch (err) {
    setMessage('Payment failed. Try again.')
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
          <button onClick={() => navigate('/checkout')} className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  )
}

export default Cart