document.querySelector('#plus-btn') .addEventListener('click',function(){
    let qty = parseInt(document.querySelector('#qty-number').textContent)
    qty = qty+1
    document.querySelector('#qty-number').textContent=qty
    updateTotal()
})

document.querySelector('#minus-btn') .addEventListener('click',function(){
    let qty = parseInt(document.querySelector('#qty-number').textContent)
    if (qty>1){
        qty = qty-1
    }
    document.querySelector('#qty-number').textContent=qty
    updateTotal()
})

document.querySelector('#remove-btn') .addEventListener('click',function(){
    document.querySelector('#cart-item').remove()
})

function updateTotal(){
    let price = parseInt(document.querySelector('#price').dataset.price)
    let qty   = parseInt(document.querySelector('#qty-number').textContent)
    let total = price*qty
    document.querySelector('#cart-total').textContent = `Total Price: ₹${total}`
}
updateTotal()