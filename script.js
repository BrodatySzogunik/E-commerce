'use strict'
let cart = document.getElementById('cart')
let cartBox = document.getElementById("cartBox")

let categoriesDropdown= document.getElementById("categoriesDropdown")
let categoriesDropdownBody = document.getElementById("categoriesDropdownBody")
let categoryChewronUp = document.getElementById("categoryChewronUp")
let categoryChewronDown = document.getElementById("categoryChewronDown")

let filtersDropdown = document.getElementById("filtersDropdown")
let filtersDropdownBody= document.getElementById("filtersDropdownBody")
let filterChewronUp = document.getElementById("filterChewronUp")
let filterChewronDown = document.getElementById("filterChewronDown")
 
cart.addEventListener("click",()=>{
    if(cartBox.classList.contains("d-none"))
    {
        cartBox.classList.remove("d-none")
    }else
    {
        cartBox.classList.add("d-none")    
    }
    
})


categoriesDropdown.addEventListener("click",()=>{
    if(categoriesDropdownBody.classList.contains("d-none"))
    {
        categoriesDropdownBody.classList.remove("d-none")
        categoryChewronUp.classList.add("d-none")
        categoryChewronDown.classList.remove("d-none")
    }else
    {
        categoriesDropdownBody.classList.add("d-none")  
        categoryChewronUp.classList.remove("d-none")
        categoryChewronDown.classList.add("d-none")  
    }
    
})

filtersDropdown.addEventListener("click",()=>{
    if(filtersDropdownBody.classList.contains("d-none"))
    {
        filtersDropdownBody.classList.remove("d-none")
        filterChewronUp.classList.add("d-none")
        filterChewronDown.classList.remove("d-none")
    }else
    {
        filtersDropdownBody.classList.add("d-none")  
        filterChewronUp.classList.remove("d-none")
        filterChewronDown.classList.add("d-none")  
    }
    
})