const express = require('express')
const app = express()
app.get('/', function(req, res){
    res.send('Hello from the backend!')
})
app.get('/products', function(req, res){
    res.json([
        {id : 1, name: "Wireless Headphones", price: 9230},
        {id : 2, name: "Smart Watch", price: 4999},
        {id : 3, name: "Bluetooth Speake", price: 1999},
    ])
})
app.listen(5000, function(){
    console.log('Server is running on port 5000')
})
