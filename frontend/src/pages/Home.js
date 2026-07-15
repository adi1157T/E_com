import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Welcome to BuyHard</h1>
        <p>Best prices. Fast delivery. Shop everything you need.</p>
        <Link to="/products">
          <button className="shop-btn">Shop Now</button>
        </Link>
      </div>
    </div>
  )
}

export default Home