require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())
mongoose.connect(process.env.MONGO_URI)
 .then(()=> console.log('MongoDB connected'))
 .catch((err)=> console.log('MongoDB connection error:', err))

const productRoutes = require('./routes/productRoutes')
app.use( productRoutes)

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

app.listen(process.env.PORT, function(){
    console.log(`Server is running on port ${process.env.PORT}`)
})

