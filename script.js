'use strict'

const round =(number,decimalPlaces)=>{
    const factorOfTen = Math.pow(10,decimalPlaces)
    return Math.round(number*factorOfTen)/factorOfTen
}
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
let filtersProducerBox = document.getElementById("filtersProducerBox")
let selectSaloon = document.getElementById("selectSaloon")

let otherOptions = document.getElementById("otherOptions")

const truncate = (str, max, suffix) => (str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`);
 
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
let chosenCategory=0


const generateProducts=()=> {
    let price=""
    let discountedPrice=""
    let photo = ""
    let description=""
    let output=""
    if(chosenCategory==0){
        fetch("http://localhost:3000/products")
        .then(res=> res.json())
        .then(data=> {
            data.forEach(item=>{
                price=item.priceDiscounted?`<p class="price-striked">${item.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>
                                            <p class="fs-bigger">${item.priceDiscounted} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`:
                                            `<p class="normal-price fs-bigger">${item.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`
                
                photo=item.photos[0]?"assets\\img\\"+item.photos[0]:"https://torebki-fabiola.pl/wp-content/uploads/woocommerce-placeholder.png"
                description=truncate(item.description,100,'...')
                output+=`
                <div class="col-12 col-md-6  col-lg-4">
                    <div class="card w-100" >
                        <div class="w-100">    
                            <div class="image-container">
                                <img src="${photo}" class="card-img-top w-100 h-100" alt="...">
                            </div>
                        </div>
                        <img src="svg\\heart.svg" height="25px" class="card-heart" alt="">
                        <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text ">${description}</p>
                        ${price}
                        
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

async function generateProducents(){
    filtersProducerBox.innerHTML=`<div class="p-0 m-0">
    <h6>Producer</h6>
</div>`;
    fetch('http://localhost:3000/producers')
    .then(res=>res.json())
    .then(data=>{
        data.forEach(item=>{
            filtersProducerBox.innerHTML+=
            `
            <div class="p-0 m-0 mb-2 d-flex align-items-center">
                <input id="${item.alias}" type="checkbox">
                <label for="${item.alias}">${item.name}</label>
            </div>
            `
        })
    })
}

async function generateSaloons(){
    
    fetch("http://localhost:3000/saloons")
    .then(res => res.json())
    .then(data=>{
        data.forEach(item=>{
            selectSaloon.innerHTML+=`<option value="${item.name}">${item.name}</option>`
        })
    })

}

async function generateOtherCategories(){
    otherOptions.innerHTML=` <div class=" p-0 m-0 d-flex align-items-center">
                                <h6>Other options</h6>
                            </div>`

    fetch("http://localhost:3000/options")
    .then(res => res.json())
    .then(data=>{
        data.forEach(item=>{
            if(item.type==="single"){
                otherOptions.innerHTML+=
                `
                <div class=" p-0 m-0 mb-2 d-flex align-items-center">
                    <input id="${item.label}" type="checkbox">
                    <label for="${item.label}">${item.label}</label>
                </div>
                `
            }

        })
    })
}

async function generateCart(){
    let total=0;
    cartBox.innerHTML=""
    fetch("http://localhost:3000/cart")
    .then(res=>res.json())
    .then(data=>{
        data.forEach(item=>{
            total+=item.price
            cartBox.innerHTML+=`<div class="row container-fluid w-100 cart-item  px-0 ml-auto mr-0">
            <div class="col-2 p-0 m-0">
                <div class="w-100">    
                    <div class="image-container">
                        <img src="assets\\img\\${item.thumbnail}" class="cart-img w-100 h-100" alt="...">
                    </div>
                </div>
            </div>
            <div class="col-6 col-sm-7 text-left p-0 m-0 d-flex align-items-center">${item.name}</div>
            <div class="col-2 p-0 m-0 d-flex align-items-center">${item.price}</div>
            <div class="col-2 col-sm-1 p-0 m-0 d-flex align-items-center"><img class="mx-auto cartButton" src="svg/delete.svg" height="20px" alt=""></div>
            </div>
            <hr>
            `
        })
        cartBox.innerHTML+=`<div class="row container-fluid w-100 cart-item  ml-auto mr-0">
        <div class="col-4 col-sm-4 col-lg-3 p-0 m-0 d-flex justify-content-center text-white">
            <button type="button" class="btn btn-primary w-100">Buy</button> 
        </div>
        <div class="col-4 col-sm-5 col-lg-6 text-right pr-4 m-0 d-flex align-items-center">Total:</div>
        <div class="col-2 p-0 m-0 d-flex align-items-center ">${round(total,2)}</div>
        <div class="col-2 col-sm-1"></div>              
        </div>`
    })
}


generateProducts()
generateCategories()
generateProducents()
generateSaloons()
generateOtherCategories()
generateCart()
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