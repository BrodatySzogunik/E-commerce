
'use strict'



const round =(number,decimalPlaces)=>{
    const factorOfTen = Math.pow(10,decimalPlaces)
    return Math.round(number*factorOfTen)/factorOfTen
}




const truncate = (str, max, suffix) => (str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`);
 

const addNavBarLiteners =()=>{
    let search = document.getElementById('search')
    let searchBox = document.getElementById("searchBox")
    let cartBox = document.getElementById("cartBox")
    let cart = document.getElementById('cart')
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
    }

const addCategoriesListeners = ()=>{
    let categoryChewronUp = document.getElementById("categoryChewronUp")
    let categoryChewronDown = document.getElementById("categoryChewronDown")
    let categoriesDropdown= document.getElementById("categoriesDropdown")
    let categoriesDropdownBody = document.getElementById("categoriesDropdownBody")

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

}


async function generateCategories(){
    let categoriesDropdownBody = document.getElementById("categoriesDropdownBody")
    let categoriesCount=0
    let menuCategories = document.getElementById("menuCategories")

    categoriesDropdownBody.innerHTML=""
    menuCategories.innerHTML=""

    await fetch("http://localhost:3000/categories")
    .then(res=> res.json())
    .then(data=>{
        data.forEach(async function(item){
            categoriesCount = await getCategoriesCount(item.id)
            categoriesDropdownBody.innerHTML+=`
            <a class="text-dark text-decoration-none" href="http://localhost:5500/categories.html?category=${item.id}">
                <div id="choose-category-${item.id}" class="category-element container-fluid row m-0 border py-2 ">
                    <div class="col-10  col-lg-8 p-0 text-truncate">${item.name}</div>
                    <div class="col-2 col-lg-4 p-0">
                    <p class="categories-count rounded-pill p-0 fs-small text-center text-white m-0 font-weight-bold">${categoriesCount}</p>
                    </div> 
                </div>
                
            `
            menuCategories.innerHTML+=`<a id="menu-category-${item.id}"  class="dropdown-item text-grey" href="http://localhost:5500/categories.html?category=${item.id}">${item.name}</a>`
        })
        
    })
    
}






async function generateProduct(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    console.log(urlParams)
    let id= parseInt(urlParams.get("product-id"))


    let productCarouselIndicator = document.getElementById("productCarouselIndicator")
    let productCarouselInner = document.getElementById("productCarouselInner")
    let productBody = document.getElementById("productBody")
    let productSpec = document.getElementById("productSpec")
    let sizesTemplate=""
    let optionsTemplate=""
    let productSpecTemplate=""
    let productCarouselIndicatorTemplate=""
    let productCarouselInnerTemplate=""
    let price=""
    await fetch(`http://localhost:3000/products/${id}`)
    .then(res=>res.json())
    .then(data=>{
        price=data.priceDiscounted?`<p class="price-striked">${data.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>
                                            <p class="fs-bigger">${data.priceDiscounted} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`:
                                            `<p class="normal-price fs-bigger">${data.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`
                
        data.option[1].values.forEach(item=>{
           sizesTemplate+=
            `
            <option value="${item}">${item}</option>
            `
        })
        data.option[0].values.forEach(item=>{
            optionsTemplate+=
            `
            <option value="${item}">${item}</option>
            `
          
        })
        data.specification.forEach(item=>{
            productSpecTemplate+=
            `
            <div class="col-12 container-fluid   spec-item  productSpec">
                <div class="row m-0 p-0 w-100 ">
                    <div class="col-0 col-md-2"></div>
                    <div class="col-4 d-flex align-items-center p-0 "><h6 class="py-2 m-0">${item.name}</h6></div>
                    <div class="col-8 col-md-6 d-flex align-items-center  p-0"><p>${item.value}</p></div>
                </div>
            </div>
            `
        })
        data.photos.forEach((item,index)=>{
            console.log(item)
            
            if(index===0){
                productCarouselIndicatorTemplate+=`<li class="carousel-indicator" data-target="#carouselExampleIndicators" data-slide-to="${index}" class="active"></li>`
                productCarouselInnerTemplate+=
                `
                <div class="carousel-item active ">
                  <img src="assets\\img\\${item}" class="d-block w-100 py-auto" alt="...">
                </div>
                `
            }else{
                productCarouselIndicatorTemplate+=`<li class="carousel-indicator" data-target="#carouselExampleIndicators" data-slide-to="${index}" class=""></li>`
                productCarouselInnerTemplate+=
                `
                <div class="carousel-item">
                  <img src="assets\\img\\${item}" class="d-block w-100 py-auto" alt="...">
                </div>
                `
            }
        })
        
        
        productCarouselIndicator.innerHTML=productCarouselIndicatorTemplate
        productCarouselInner.innerHTML=productCarouselInnerTemplate
        productSpec.innerHTML=productSpecTemplate
        productBody.innerHTML=
            `
            ${data.new?`<div class="col-4 col-sm-3 col-md-2 col-xl-2 bg-success d-flex align-items-center justify-content-center px-3 py-2  m-0 text-white rounded "><h5 class="p-0 m-0">NEW</h5></div>
            `:``}
            <h3 class="col-12 p-0 m-0 mt-5">${data.name}</h3>
            <div class="col-12 p-0 my-3">${price}</div>
            <p class="col-12 p-0 m-0 mb-4">${data.description}</p>
            <h6 class="col-6   col-xl-4 p-0 m-0 mb-1">Size</h6>
            <h6 class="col-6   col-xl-4 m-0 pl-2 mb-1">Color</h6>
            <div class="col-0  col-xl-4"></div>
            <h6 class="col-6   col-xl-4 p-0 m-0 ">
                <select id="productSizes" name="size">
                ${sizesTemplate}
                </select>
            </h6>
            <h6  class="col-6  col-xl-4 p-0 m-0 pl-2">
                <select id="productColours" name="color">
                ${optionsTemplate}
                </select>
            </h6>
            <div class="col-0 col-xl-4"></div>
            <div class="col-12 p-0">
                <hr class="mx-0 p-0">
            </div>
            <div class=" col-10 col-lg-4 col-xl-5 pr-2 p-0 m-0">
                <button type="button" class="btn btn-primary btn-lg w-100">Add to cart</button>
            </div>
            <div class="col-2 col-lg-2 col-xl-1 p-0 m-0  d-flex align-items-center"> <input class="w-100  rounded border-1" type="number" value="1"></div>

            `   
    })
}







async function generateCart(){
    let cartBox = document.getElementById("cartBox")
    let cart = document.getElementById("cart")
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
        cart.innerHTML=
        `
        <div  class="cart-box d-flex align-items-center justify-content-center">
            <img class="mx-auto " src="svg/shopping-basket.svg" height="30px" alt="" >
            <div class="cartCounter">${data.length}</div>
        </div>
        `
    })
}


 async function getCategoriesCount(id){
    const categoriesCount = await fetch(`http://localhost:3000/products?category=${id}`)
    .then(res=> res.json())
    .then(data=>{return data.length})
    .catch(error=>{return error})
    return categoriesCount
}



async function generateProduct(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    console.log(urlParams)
    let id= parseInt(urlParams.get("product-id"))


    let productCarouselIndicator = document.getElementById("productCarouselIndicator")
    let productCarouselInner = document.getElementById("productCarouselInner")
    let productBody = document.getElementById("productBody")
    let productSpec = document.getElementById("productSpec")
    let sizesTemplate=""
    let optionsTemplate=""
    let productSpecTemplate=""
    let productCarouselIndicatorTemplate=""
    let productCarouselInnerTemplate=""
    let price=""
    await fetch(`http://localhost:3000/products/${id}`)
    .then(res=>res.json())
    .then(data=>{
        price=data.priceDiscounted?`<p class="price-striked">${data.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>
                                            <p class="fs-bigger">${data.priceDiscounted} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`:
                                            `<p class="normal-price fs-bigger">${data.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`
                
        data.option[1].values.forEach(item=>{
           sizesTemplate+=
            `
            <option value="${item}">${item}</option>
            `
        })
        data.option[0].values.forEach(item=>{
            optionsTemplate+=
            `
            <option value="${item}">${item}</option>
            `
          
        })
        data.specification.forEach(item=>{
            productSpecTemplate+=
            `
            <div class="col-12 container-fluid   spec-item  productSpec">
                <div class="row m-0 p-0 w-100 ">
                    <div class="col-0 col-md-2"></div>
                    <div class="col-4 d-flex align-items-center p-0 "><h6 class="py-2 m-0">${item.name}</h6></div>
                    <div class="col-8 col-md-6 d-flex align-items-center  p-0"><p>${item.value}</p></div>
                </div>
            </div>
            `
        })
        data.photos.forEach((item,index)=>{
            console.log(item)
            
            if(index===0){
                productCarouselIndicatorTemplate+=`<li class="carousel-indicator" data-target="#carouselExampleIndicators" data-slide-to="${index}" class="active"></li>`
                productCarouselInnerTemplate+=
                `
                <div class="carousel-item active ">
                  <img src="assets\\img\\${item}" class="d-block w-100 py-auto" alt="...">
                </div>
                `
            }else{
                productCarouselIndicatorTemplate+=`<li class="carousel-indicator" data-target="#carouselExampleIndicators" data-slide-to="${index}" class=""></li>`
                productCarouselInnerTemplate+=
                `
                <div class="carousel-item">
                  <img src="assets\\img\\${item}" class="d-block w-100 py-auto" alt="...">
                </div>
                `
            }
        })
        
        
        productCarouselIndicator.innerHTML=productCarouselIndicatorTemplate
        productCarouselInner.innerHTML=productCarouselInnerTemplate
        productSpec.innerHTML=productSpecTemplate
        productBody.innerHTML=
            `
            ${data.new?`<div class="col-4 col-sm-3 col-md-2 col-xl-2 bg-success d-flex align-items-center justify-content-center px-3 py-2  m-0 text-white rounded "><h5 class="p-0 m-0">NEW</h5></div>
            `:``}
            <h3 class="col-12 p-0 m-0 mt-5">${data.name}</h3>
            <div class="col-12 p-0 my-3">${price}</div>
            <p class="col-12 p-0 m-0 mb-4">${data.description}</p>
            <h6 class="col-6   col-xl-4 p-0 m-0 mb-1">Size</h6>
            <h6 class="col-6   col-xl-4 m-0 pl-2 mb-1">Color</h6>
            <div class="col-0  col-xl-4"></div>
            <h6 class="col-6   col-xl-4 p-0 m-0 ">
                <select id="productSizes" name="size">
                ${sizesTemplate}
                </select>
            </h6>
            <h6  class="col-6  col-xl-4 p-0 m-0 pl-2">
                <select id="productColours" name="color">
                ${optionsTemplate}
                </select>
            </h6>
            <div class="col-0 col-xl-4"></div>
            <div class="col-12 p-0">
                <hr class="mx-0 p-0">
            </div>
            <div class=" col-10 col-lg-4 col-xl-5 pr-2 p-0 m-0">
                <button type="button" class="btn btn-primary btn-lg w-100">Add to cart</button>
            </div>
            <div class="col-2 col-lg-2 col-xl-1 p-0 m-0  d-flex align-items-center"> <input class="w-100  rounded border-1" type="number" value="1"></div>

            `   
    })
}

const generateProducts=()=> {

    let chosenCategory=0
    let categoriesItems = document.getElementById("categories-items");
    let price=""
    let photo = ""
    let description=""
    let output=""

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    console.log(urlParams)
    chosenCategory= parseInt(urlParams.get("category"))?parseInt(urlParams.get("category")):0

    if(chosenCategory===0){
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
                    <a class="cardLink text-dark text-decoration-none" href="http://localhost:5500/product.html?product-id=${item.id}">
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
        fetch(`http://localhost:3000/products?category=${chosenCategory}`)
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
                    <a class="cardLink text-dark text-decoration-none" href="http://localhost:5500/product.html?product-id=${item.id}">  
                        <div class="card w-100" >
                            <div class="w-100">    
                                <div class="image-container">
                                    <img src="${photo}" class="card-img-top w-100 h-100" alt="...">
                                </div>
                            </div>
                            <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text ">${description}</p>
                            ${price}
                            
                            </div>
                        </div>
                    </a>    
                </div>
                `
            })
            categoriesItems.innerHTML=output
        })
    }
    
}
generateProduct()
generateCategories()
generateCart()
addNavBarLiteners()
addCategoriesListeners()