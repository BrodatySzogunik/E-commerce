let cart = document.getElementById('cart')
let cartBox = document.getElementById("cartBox")
cart.addEventListener("click",()=>{
    if(cartBox.classList.contains("d-none"))
    {
        cartBox.classList.remove("d-none")
    }else
    {
        cartBox.classList.add("d-none")    
    }
    
})