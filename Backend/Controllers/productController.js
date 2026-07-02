function getProducts(req, res){
    res.json([
        {id : 1, name: "Wireless Headphones", price: 9230},
        {id : 2, name: "Smart Watch", price: 4999},
        {id : 3, name: "Bluetooth Speake", price: 1999},    
    ])
}
module.exports = {getProducts}