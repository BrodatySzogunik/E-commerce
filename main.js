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

async function generateProducts(onPage) {

        let recommendedItems = document.getElementById("recommendedItems");
        let price=""
        let photo = ""
        let description=""
        let output=""
        
        const favorites = await fetch("http://localhost:3000/favorites")
                            .then(res=>res.json())
                            .then(data=>{return data})
        const favoritesArray = favorites.map((item)=>{
            return item.id
        })

            fetch(`http://localhost:3000/products?_start=0&_end=${onPage+1}`)
            .then(res=> res.json())
            .then(data=> {
                data.forEach((item,idx)=>{
                    if(idx!=onPage){
                        price=item.priceDiscounted?`<p class="price-striked">${item.price} PLN </p>
                                                <p class="fs-bigger">${item.priceDiscounted} PLN <img src="svg\\add-to-cart.svg" data-id="${item.id}" data-price="${item.priceDiscounted}" data-qty="1" class="card-cart" alt=""></p>`:
                                                `<p class="normal-price fs-bigger">${item.price} PLN <img src="svg\\add-to-cart.svg" data-id="${item.id}" data-price="${item.price}" data-qty="1" class="card-cart" alt=""></p>`
                    
                        photo=item.photos[0]?"assets\\img\\"+item.photos[0]:"https://torebki-fabiola.pl/wp-content/uploads/woocommerce-placeholder.png"
                        description=truncate(item.description,100,'...')
                        output+=`
                        <div class="col-12 col-sm-4 col-md-3  productCard">
                            <a class="cardLink text-dark text-decoration-none" href="http://localhost:5500/product.html?product-id=${item.id}">
                                <div class="card w-100" >
                                    <div class="w-100">    
                                        <div class="image-container">
                                            <img src="${photo}" class="card-img-top w-100 h-100" alt="...">
                                        </div>
                                    </div>
                                    <img src="svg\\heart.svg" height="25px" data-id="${item.id}" class="${favoritesArray.includes(item.id)?"card-heart-fav":"card-heart"}" alt="">
                                    <div class="card-body">
                                    <p class="fs-small text-dark">${item.id}</p>
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

    async function generateCart(){
        let cartBox = document.getElementById("cartBox")
        let cart = document.getElementById("cart")
        let total=0
        let totalItems=0
        let cartBoxTemplate=""
    
        cartBox.innerHTML=""
        await fetch("http://localhost:3000/cart")
        .then(res=>res.json())
        .then(data=>{
            data.forEach(item=>{
                totalItems+=Number(item.qty)
                total+=item.price*item.qty
                cartBoxTemplate+=
                `
                <div class="row container-fluid w-100 cart-item px-0 ml-auto mr-0" data-id="${item.id}" data-item_id="${item.productId}" data-size="${item.size?item.size:""}" data-color="${item.color?item.color:""}" data-productId="${item.productId}" data-qty="${item.qty}">
                    <div class="col-2 p-0 m-0">
                        <div class="w-100">    
                            <div class="image-container">
                                <img src="assets\\img\\${item.thumbnail}" class="cart-img w-100 h-100" alt="...">
                                <div class="productCounter">${item.qty}x</div>
                                ${item.size?`<div class="productSize">${item.size}</div>`:""}
                                ${item.color?`<div class="productColor" style="background-color:${item.color}"></div>`:""}
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-sm-7 text-left p-0 m-0 d-flex align-items-center">${item.name}</div>
                    <div class="col-2 p-0 m-0 d-flex align-items-center">${round(item.price,2)}</div>
                    <div class="col-2 col-sm-1 p-0 m-0 d-flex align-items-center"><img class="mx-auto cartButton" data-id="${item.id}" src="svg/delete.svg" height="20px" alt=""></div>
                </div>
                <hr>
                `
            })
            if(total===0){
                cartBoxTemplate=
                `<div class="row container-fluid w-100 cart-item  px-0 ml-auto mr-0">
                <div class="col-12 p-0 m-0 d-flex align-items-center justify-content-center"><p class="fs-bigger text-dark">Cart is empty<p></div>
                </div>
                <hr>
                `
    
            }else{
            cartBoxTemplate+=`<div class="row container-fluid w-100 cart-item  ml-auto mr-0">
            <div class="col-4 col-sm-4 col-lg-3 p-0 m-0 d-flex justify-content-center text-white">
                <button type="button" class="btn btn-primary w-100">Buy</button> 
            </div>
            <div class="col-4 col-sm-5 col-lg-6 text-right pr-4 m-0 d-flex align-items-center">Total:</div>
            <div class="col-2 p-0 m-0 d-flex align-items-center ">${round(total,2)}</div>
            <div class="col-2 col-sm-1"></div>              
            </div>`
            }
            cartBox.innerHTML = cartBoxTemplate
            cart.innerHTML=
            `
            <div  class="cart-box d-flex align-items-center justify-content-center">
                <img class="mx-auto " src="svg/shopping-basket.svg" height="30px" alt="" >
                <div class="cartCounter">${Number(totalItems)}</div>
            </div>
            `
        })
        
    }

    async function addItemToFav(data){
        const payload = {
            method:"POST",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                id:Number(data.id),
            })
        }
        try{
            await fetch("http://localhost:3000/favorites",payload)
        }catch(e){
            console.log(e)
        }
    
    }

    async function removeItemFromFav(data){
        const payload = {
            method:"DELETE",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
            },
        }
        try{
            await fetch(`http://localhost:3000/favorites/${data.id}`,payload)
        }catch(e){
            console.log(e)
        }
    
    }

    async function addItemToCart(data){
        const cartBox = document.getElementById("cartBox")
        let existInCart = false
        let itemQty
        let payload
        let cartPositionId
        let uri
    
    
        console.log(Array.from(cartBox.children))
        Array.from(cartBox.children).forEach(item=>{
            console.log(Number(item.dataset.id),Number(data.id))
            if(Number(item.dataset.productid) === Number(data.id)){
                existInCart=true
                cartPositionId = item.dataset.id
                itemQty=Number(item.dataset.qty)
            }
        })
        
        if(existInCart){
            uri = `http://localhost:3000/cart/${cartPositionId}`
            payload = {
            method:"PATCH",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                productId:Number(data.id),
                price:Number(data.price),
                qty:itemQty+Number(data.qty),
                name:"name",
                thumbnail:"something.jpg".toString,
                size:"M",
                color:"black"
            })
            }
        }else{
            uri = `http://localhost:3000/cart`
            payload = {
                method:"POST",
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    productId:Number(data.id),
                    price:Number(data.price),
                    qty:1,
                    name:"name",
                    thumbnail:"something.jpg",
                    size:"M",
                    color:"black"
                })
                }
        }
    
        try{
            await fetch(uri,payload)
        }catch(e){
            console.log(e)
        }
        await generateCart()
    }

    const generateCartListeners=()=>{
        const cartBox = document.getElementById("cartBox")
    
        cartBox.addEventListener('click',(event)=>{
            if(event.target.classList.contains("cartButton")){
                event.target.dataset.id.split(",").forEach(item=>removeItemFromCart(item))
            }
        })
    }

    async function removeItemFromCart(id){
        const payload = {
            method:"DELETE",
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        }
        try{
            await fetch(`http://localhost:3000/cart/${id}`,payload)
        }catch(e){
            console.log(e)
        }
        await generateCart()
        

    
}

    
    const generateCardListeners=()=>{
        const categoriesItems = document.getElementById("recommendedItems")
    
        categoriesItems.addEventListener('click',(event)=>{
    
            if(event.target.classList.contains("card-cart")){
                event.preventDefault()
                addItemToCart(event.target.dataset)
            }
            if(event.target.classList.contains("card-heart")||event.target.classList.contains("card-heart-fav")){
                event.preventDefault()
                if(event.target.classList.contains("card-heart-fav")){
                    removeItemFromFav(event.target.dataset)
                    event.target.classList.remove("card-heart-fav")
                    event.target.classList.add("card-heart")
                }else{
                    addItemToFav(event.target.dataset)
                    event.target.classList.add("card-heart-fav")
                    event.target.classList.remove("card-heart")
                }
                
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
addNavBarLiteners()
generateProducts(onPage)
generateCart()
generateCardListeners()
generateCartListeners()