const express = require('express')
const app = express()
const productRoutes = require('./routes/productRoutes')

app.use(productRoutes)
app.listen(5000, function(){
    console.log('Server is running on port 5000')
})
