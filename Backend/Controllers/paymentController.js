const Razorpay = require('razorpay')
const Order = require('../models/orderModel')
const Cart = require('../models/cartModel')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    res.status(500).json({ message: 'Payment order creation failed', error })
  }
}

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const crypto = require('crypto')

    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature === expectedSign) {
      res.status(200).json({ message: 'Payment verified successfully' })
    } else {
      res.status(400).json({ message: 'Payment verification failed' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { createOrder, verifyPayment }