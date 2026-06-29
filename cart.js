document.querySelector('#plus-btn') .addEventListener('click',function(){
    let qty = parseInt(document.querySelector('#qty-number').textContent)
    qty = qty+1
    document.querySelector('#qty-number').textContent=qty
})

document.querySelector('#minus-btn') .addEventListener('click',function(){
    let qty = parseInt(document.querySelector('#qty-number').textContent)
    if (qty>1){
        qty = qty-1
    }
    
    document.querySelector('#qty-number').textContent=qty
})

document.querySelector('#remove-btn') .addEventListener('click',function(){
    document.querySelector('#cart-item').remove()
})