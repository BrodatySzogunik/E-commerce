'use strict'
let cart = document.getElementById('cart')
let cartBox = document.getElementById("cartBox")

let search = document.getElementById('search')
let searchBox = document.getElementById("searchBox")

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
        searchBox.classList.add('d-none')
        
        
    }else
    {
        cartBox.classList.add("d-none")    
    }
    
})

search.addEventListener('click', ()=>{
    if(searchBox.classList.contains("d-none"))
    {
        searchBox.classList.remove("d-none")
        cartBox.classList.add('d-none')
    }else
    {
        searchBox.classList.add("d-none")    
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


let categoriesItems = document.getElementById("categories-items");



let productId
let output="";
let chosenCategory=0


const generateProducts=()=> {
    output=""
    if(chosenCategory==0){
        fetch("http://localhost:3000/products")
        .then(res=> res.json())
        .then(data=> {
            data.forEach(item=>{
                output+=`
                <div class="col-12 col-md-6  col-lg-4">
                    <div class="card w-100" >
                        <img src="assets\\img\\7a67c57a311acdbd258694542cf442d6.jpg" class="card-img-top" alt="...">
                        <img src="svg\\heart.svg" height="25px" class="card-heart" alt="">
                        <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text text-truncate">${item.description}</p>
                        <p class="fs-bigger">${item.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>
                        
                        </div>
                    </div>
                </div>
                `
            })
            categoriesItems.innerHTML=output
        })
    }else{

    }
    
}

generateProducts()

async function generateCategories(){
    let categoriesCount=0
    categoriesDropdownBody.innerHTML=""
    await fetch("http://localhost:3000/categories")
    .then(res=> res.json())
    .then(data=>{
        data.forEach(async function(item){
            categoriesCount = await getCategoriesCount(item.id)
            console.log(categoriesCount)
            categoriesDropdownBody.innerHTML+=`
            <div id="choose-category-${item.id}" class="category-element container-fluid row m-0 border py-2 rounded-top">
                <div class="col-10  col-lg-8 p-0 text-truncate">${item.name}</div>
                <div class="col-2  col-lg-4 p-0">
                    <p class="categories-count rounded-pill p-0 fs-small text-center text-white m-0 font-weight-bold">${categoriesCount}</p>
                </div> 
            </div>
            `
            console.log("done")
        })
        
    })
    
}

generateCategories()

//  async function getCategoriesCount(){
//      let promises=[]
//     await fetch("http://localhost:3000/categories")
//      .then(res=>res.json())
//      .then(data=>data.forEach(item=>{
//          promises.push(fetch(`http://localhost:3000/products/${item.id}`))
//      }))
//      Promise.all(promises)
//      .then(values=>{
//          let data = []
//          values.forEach(item=>{
//              data.push(item.json())
//          })
//          return data
//      })
//      .then(data=>console.log(data))
//  }

//  getCategoriesCount()



 async function getCategoriesCount(id){
    const categoriesCount = await fetch(`http://localhost:3000/products?category=${id}`)
    .then(res=> res.json())
    .then(data=>{return data.length})
    .catch(error=>{return error})
    return categoriesCount

}

let categoriesCount

(async ()=>{
    categoriesCount = await getCategoriesCount(1)
    
})()

setTimeout(()=>console.log(categoriesCount),1000)