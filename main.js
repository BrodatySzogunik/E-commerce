'use strict'


const round =(number,decimalPlaces)=>{
    const factorOfTen = Math.pow(10,decimalPlaces)
    return Math.round(number*factorOfTen)/factorOfTen
}

const truncate = (str, max, suffix) => (str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`);

let onPage = 12;

async function generateCategories(){

    let categoriesCount=0
    let menuCategories = document.getElementById("menuCategories")

    menuCategories.innerHTML=""

    await fetch("http://localhost:3000/categories")
    .then(res=> res.json())
    .then(data=>{
        data.forEach(async function(item){
            categoriesCount = await getCategoriesCount(item.id)
            menuCategories.innerHTML+=`<a id="menu-category-${item.id}"  class="dropdown-item text-grey" href="http://localhost:5500/categories.html?category=${item.id}">${item.name}</a>`
        })
        
    })
    
}

async function generateCart(){
    let cartBox = document.getElementById("cartBox")
    let cart = document.getElementById("cart")
    let total=0;
    let cartTemplate =""
    cartBox.innerHTML=""
    fetch("http://localhost:3000/cart")
    .then(res=>res.json())
    .then(data=>{
        data.forEach(item=>{
            total+=item.price
            cartTemplate+=`<div class="row container-fluid w-100 cart-item  px-0 ml-auto mr-0">
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
        cartTemplate+=`<div class="row container-fluid w-100 cart-item  ml-auto mr-0">
        <div class="col-4 col-sm-4 col-lg-3 p-0 m-0 d-flex justify-content-center text-white">
            <button type="button" class="btn btn-primary w-100">Buy</button> 
        </div>
        <div class="col-4 col-sm-5 col-lg-6 text-right pr-4 m-0 d-flex align-items-center">Total:</div>
        <div class="col-2 p-0 m-0 d-flex align-items-center ">${round(total,2)}</div>
        <div class="col-2 col-sm-1"></div>              
        </div>`
        cartBox.innerHTML=cartTemplate
        cart.innerHTML=
        `
        <div  class="cart-box d-flex align-items-center justify-content-center">
            <img class="mx-auto " src="svg/shopping-basket.svg" height="30px" alt="" >
            <div class="cartCounter">${data.length}</div>
        </div>
        `
    })
}

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
    let loadMoreButton = document.getElementById("loadMoreButton")
    loadMoreButton.addEventListener("click",()=>{
        onPage+=12
        generateProducts(onPage)

    })

    const generateProducts=(onPage)=> {

        let recommendedItems = document.getElementById("recommendedItems");
        let price=""
        let photo = ""
        let description=""
        let output=""

            fetch(`http://localhost:3000/products?_start=0&_end=${onPage+1}`)
            .then(res=> res.json())
            .then(data=> {
                data.forEach((item,idx)=>{
                    if(idx!=onPage){
                        price=item.priceDiscounted?`<p class="price-striked">${item.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>
                                                    <p class="fs-bigger">${item.priceDiscounted} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`:
                                                    `<p class="normal-price fs-bigger">${item.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`
                        
                        photo=item.photos[0]?"assets\\img\\"+item.photos[0]:"https://torebki-fabiola.pl/wp-content/uploads/woocommerce-placeholder.png"
                        description=truncate(item.description,100,'...')
                        output+=`
                        <div class="col-12 col-md-4  col-lg-3">
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
                            </a>
                        </div>
                        `
                        
                    }
                })
                recommendedItems.innerHTML=output
                if((data.length<=onPage)&&(onPage!==12)){
                    loadMoreButton.classList.add("d-none")
                }
            })
        
    }

    
async function getCategoriesCount(id){
    const categoriesCount = await fetch(`http://localhost:3000/products?category=${id}`)
    .then(res=> res.json())
    .then(data=>{return data.length})
    .catch(error=>{return error})
    return categoriesCount
}


generateCategories()
// generateCart()
addNavBarLiteners()
generateProducts(onPage)