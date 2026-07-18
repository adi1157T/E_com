import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/index'

function Checkout() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
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

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
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

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!address.fullName || !address.phone || !address.address || !address.city || !address.state || !address.pincode) {
      setMessage('Please fill all address fields')
      return
    }

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
            await API.post('/orders', { shippingAddress: address })
            setMessage('Payment successful! Order placed.')
            setTimeout(() => navigate('/orders'), 2000)
          } catch (err) {
            setMessage('Payment verification failed')
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone
        },
        theme: { color: '#7C3AED' }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (err) {
      setMessage('Payment failed. Try again.')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!cart || cart.items.length === 0) return <div className="loading">Your cart is empty</div>

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {message && <p className="error-msg">{message}</p>}
      <div className="checkout-layout">
        <div className="checkout-form">
          <h2>Shipping Address</h2>
          <form onSubmit={handlePayment}>
            <input placeholder="Full Name" value={address.fullName}
              onChange={(e) => setAddress({...address, fullName: e.target.value})} />
            <input placeholder="Phone Number" value={address.phone}
              onChange={(e) => setAddress({...address, phone: e.target.value})} />
            <input placeholder="Address" value={address.address}
              onChange={(e) => setAddress({...address, address: e.target.value})} />
            <input placeholder="City" value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})} />
            <input placeholder="State" value={address.state}
              onChange={(e) => setAddress({...address, state: e.target.value})} />
            <input placeholder="Pincode" value={address.pincode}
              onChange={(e) => setAddress({...address, pincode: e.target.value})} />
            <button type="submit" className="checkout-btn">
              Pay ₹{calculateTotal()}
            </button>
          </form>
        </div>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.items.map(item => (
            <div key={item._id} className="checkout-item">
              <p>{item.product.name}</p>
              <p>₹{item.product.price} x {item.quantity}</p>
            </div>
          ))}
          <div className="checkout-total">
            <p>Total: ₹{calculateTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout