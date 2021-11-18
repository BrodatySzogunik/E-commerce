
'use strict'

// const { url } = require("inspector");



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
    let filtersDropdown = document.getElementById("filtersDropdown")
    let filtersDropdownBody= document.getElementById("filtersDropdownBody") 
    let filterChewronUp = document.getElementById("filterChewronUp")
    let filterChewronDown = document.getElementById("filterChewronDown")

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
}







async function generateProducts(){

    const categoriesItems = document.getElementById("categories-items")
    // const whereAmI = document.getElementById("whereAmI")
    const paginationContainers = document.querySelectorAll(".pagination")
    const perPageContainer = document.getElementById('productsPerPage')
   


    let price=""
    let photo = ""
    let description=""
    let output=""

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)

    
    const apiSearchParams = new URLSearchParams();


    let producents = urlParams.getAll("producer")
    let otherCategories = urlParams.getAll("options")
    let chosenCategory = parseInt(urlParams.get("category"))?parseInt(urlParams.get("category")):0
    let saloon = Number(urlParams.get('saloon'))
    let page = urlParams.get("page")?Number(urlParams.get("page")):1
    let perPage = urlParams.get("per-page")?Number(urlParams.get("per-page")):6

    if(urlParams.get('price_gte')!==null){
        apiSearchParams.set('price_gte',urlParams.get('price_gte'))
    }
    if(urlParams.get('price_lte')!==null){
        apiSearchParams.set('price_lte',urlParams.get('price_lte'))
    }

    if(chosenCategory!==0){
        apiSearchParams.set("category",chosenCategory)
    }
    apiSearchParams.set("_page",page)
    apiSearchParams.set("_limit",perPage)
    producents.forEach(item=> {
        apiSearchParams.append("producer",Number(item))
    })

    otherCategories.forEach(item=> {
            apiSearchParams.append("options",Number(item))
    })
    if(chosenCategory!=0){
        apiSearchParams.set("category",chosenCategory)
    }
    if(saloon!==0){
        apiSearchParams.set("saloon",saloon)
    }

    const favorites = await fetch("http://localhost:3000/favorites")
                            .then(res=>res.json())
                            .then(data=>{return data})
    const favoritesArray = favorites.map((item)=>{
        return item.id
    })



        await fetch(`http://localhost:3000/products?${apiSearchParams.toString()}`)
        .then(res=>{
            generatePagination(Math.ceil(res.headers.get("X-Total-Count")/perPage))
            return res.json()})
        .then(data=> {
            if(data.length===0){
                output=
                `
                <div class="col-12 d-flex justify-content-center pt-5">
                    <h3 class="text-dark">Nothing to display :< </h3>
                </div>
                `
                paginationContainers.forEach(item=>{item.classList.add('d-none')})
                perPageContainer.classList.add('d-none')
            }else{
                data.forEach(item=>{
                    price=item.priceDiscounted?`<p class="price-striked">${item.price} PLN </p>
                                                <p class="fs-bigger">${item.priceDiscounted} PLN <img src="svg\\add-to-cart.svg" data-id="${item.id}" data-price="${item.priceDiscounted}" data-qty="1" class="card-cart" alt=""></p>`:
                                                `<p class="normal-price fs-bigger">${item.price} PLN <img src="svg\\add-to-cart.svg" data-id="${item.id}" data-price="${item.price}" data-qty="1" class="card-cart" alt=""></p>`
                    
                    photo=item.photos[0]?"assets\\img\\"+item.photos[0]:"https://torebki-fabiola.pl/wp-content/uploads/woocommerce-placeholder.png"
                    description=truncate(item.description,100,'...')
                    output+=`
                    <div class="col-12 col-md-6 col-lg-4 productCard">
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
                })
            }
            categoriesItems.innerHTML=output
            // whereAmI.innerText =`Categories`
        })
        generateBreadCrump()
    
}

async function generateBreadCrump(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    let chosenCategory = urlParams.get('category')
    let categoryName

    await fetch(`http://localhost:3000/categories/${chosenCategory}`)
    .then(res=>res.json())
    .then(data=>{
        categoryName=data.name
    })

    const breadCrump = document.getElementById("breadCrump")
    breadCrump.innerHTML=`<a href="http://localhost:5500/main.html">Home</a>&nbsp/&nbsp<span class="text-dark"><a href="http://localhost:5500/categories.html?category=${chosenCategory}"><span class="text-dark">${categoryName!=undefined?categoryName:"Products"}</span></a>`
    
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
            <a class="text-dark text-decoration-none" data-categoryId="${item.id}" data-categoryName="${item.name}" href="http://localhost:5500/categories.html?category=${item.id}">
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
            thumbnail:"something.jpg"
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
                thumbnail:"something.jpg"
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

const generateCardListeners=()=>{
    const categoriesItems = document.getElementById("categories-items")

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

const generatePriceListeners=()=>{
    const priceFrom = document.getElementById("price-from")
    const priceTo =document.getElementById("price-to")

    priceFrom.addEventListener('input',()=>{
        generateQueryString()
        generateProducts()
    })

    priceTo.addEventListener('input',()=>{
        generateQueryString()
        generateProducts()
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


async function generateFilters(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    let chosenCategory = parseInt(urlParams.get("category"))?parseInt(urlParams.get("category")):0

    let filtersProducerBox = document.getElementById("filtersProducerBox")
    filtersProducerBox.innerHTML=`<div class="p-0 m-0">
                                    <h6>Producer</h6>
                                </div>`;
    await fetch('http://localhost:3000/producers')
    .then(res=>res.json())
    .then(data=>{
        data.forEach(item=>{
            let newElement = document.createElement('div')
            newElement.innerHTML=`
                <div class="p-0 m-0 mb-2 d-flex align-items-center">
                    <input id="producer-${item.id}" type="checkbox" value="${item.id}" name="producents">
                    <label for="producer-${item.id}">${item.name}</label>
                </div>
                `
            filtersProducerBox.appendChild(newElement)
        })
    })

    let selectSaloon = document.getElementById("selectSaloon")
    await fetch("http://localhost:3000/saloons")
    .then(res => res.json())
    .then(data=>{
        data.forEach(item=>{
            selectSaloon.innerHTML+=`<option  value="${item.id}">${item.name}</option>`
        })
    })
    
    let otherOptions = document.getElementById("otherOptions")
    otherOptions.innerHTML=` <div class=" p-0 m-0 d-flex align-items-center">
                                <h6>Other options</h6>
                            </div>`
    await fetch(`http://localhost:3000/options?category=${chosenCategory}`)
    .then(res => res.json())
    .then(data=>{
        data.forEach(item=>{
            if(item.type==="single"){
                let newElement = document.createElement('div')
                newElement.innerHTML=
                `
                <div class=" p-0 m-0 mb-2 d-flex align-items-center">
                    <input id="otherCategory-${item.id}" value="${item.id}" type="checkbox" name="otherCategories">
                    <label for="${item.label}">${item.label}</label>
                </div>
                `
                otherOptions.appendChild(newElement)
            }

        })
    })
    
    
}


function generateFiltersListeners(){

    const filtersDropdownBody = document.getElementById("filtersDropdownBody")

    filtersDropdownBody.addEventListener('change',(event)=>{
        if((event.target.name==="producents")||(event.target.name==="otherCategories")||(event.target.name==="availible")){
            generateQueryString()
            generateProducts()
        }
        
    })

}



function generateQueryString(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    let chosenCategory = parseInt(urlParams.get("category"))?parseInt(urlParams.get("category")):0

    const producents = document.querySelectorAll("input[name='producents']")
    const otherCategories = document.querySelectorAll("input[name='otherCategories']")
    const productsPerPage = document.getElementById("productsPerPage")
    const page = document.querySelector(".pagination")
    let pageNumber = page.querySelector('.active')?Number(page.querySelector('.active').firstChild.innerText):1
    const priceFrom = document.getElementById("price-from")
    const priceTo =document.getElementById("price-to")
    const selectSaloon = document.getElementById("selectSaloon")


    const urlNewParams = new URLSearchParams()


    if(chosenCategory!==0){
        urlNewParams.append("category",chosenCategory)
    }
    urlNewParams.append("page",pageNumber)


    urlNewParams.append("per-page",Number(productsPerPage.value)?Number(productsPerPage.value):6)
   
    
    
    producents.forEach(item=>{
        if(item.checked){
            urlNewParams.append("producer",item.value)
        }
    })
    otherCategories.forEach(item =>{
        if(item.checked){
            urlNewParams.append("options",item.value)
        }
    })

    if(Number(priceFrom.value)!==0){
        urlNewParams.append("price_gte",Number(priceFrom.value))
    }

    if(Number(priceTo.value)!==0){
        urlNewParams.append("price_lte",Number(priceTo.value))
    }

    if(Number(selectSaloon.value)!==0){
        urlNewParams.set("saloon",Number(selectSaloon.value))
    }

    window.history.replaceState({},'',`categories.html?${urlNewParams}`)

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
            <div class="row container-fluid w-100 cart-item px-0 ml-auto mr-0" data-id="${item.id}" data-productId="${item.productId}" data-qty="${item.qty}">
                <div class="col-2 p-0 m-0">
                    <div class="w-100">    
                        <div class="image-container">
                            <img src="assets\\img\\${item.thumbnail}" class="cart-img w-100 h-100" alt="...">
                            <div class="productCounter">${item.qty}x</div>
                            ${item.size?`<div class="productSize">${item.size}</div>`:""}
                            ${item.color?`<div class="productColor productColor-${item.color}"></div>`:""}
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


function generateMainCarousel(){
    const mainCarousel = document.getElementById("main-carousel")
    let carouselInnerTemplate = ""
    fetch('http://localhost:3000/slides')
    .then(res=> res.json())
    .then(data => {
        data.forEach((item,index)=>{
            carouselInnerTemplate+=index===0?
            `
            <div class="carousel-item active">
                <div class="container">
                    <div class="row m-0">
                        <div class="col-lg-6">
                            <h1>${item.title}</h1>
                            <h3 class="text-secondary">${item.subtitle}</h3>
                            <p>${item.description}</p>
                            <button type="button" class="btn btn-outline-primary float-right">${item.button.label}</button>
                        </div>
                        <div class="col-lg-6">
                            <img src="assets/img/${item.productImage}" class="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
            `:
            `
            <div class="carousel-item">
                <div class="container">
                    <div class="row m-0">
                        <div class="col-lg-6">
                            <h1>${item.title}</h1>
                            <h3 class="text-secondary">${item.subtitle}</h3>
                            <p>${item.description}</p>
                            <button type="button" class="btn btn-outline-primary float-right">${item.button.label}</button>
                        </div>
                        <div class="col-lg-6">
                            <img src="assets/img/${item.productImage}" class="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
            `
        })
        mainCarousel.innerHTML=carouselInnerTemplate
    })
    
}

async function getCategoriesCount(id){
    const categoriesCount = await fetch(`http://localhost:3000/products?category=${id}`)
    .then(res=> res.json())
    .then(data=>{return data.length})
    .catch(error=>{return error})
    return categoriesCount
}


function generatePagination(numberOfPages){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const activeItem = Number(urlParams.get("page"))
    let paginationContainers = document.querySelectorAll(".pagination")
    let paginationTemplate=""

        if(activeItem === 1){
            paginationTemplate+=
            `
            <li class="page-item">
                <span aria-hidden="true" class="page-link pagination-item page-first disabled">&laquo;</span>
            </li>
            `
        }else{
            paginationTemplate+=
            `
            <li class="page-item">
                <span aria-hidden="true" class="page-link pagination-item page-first">&laquo;</span>
            </li>
            `
        }
        for(let idx=activeItem-1;idx<activeItem+2;idx++){
            if(idx>0&&idx<=numberOfPages){
                if(idx===activeItem){
                    if(idx===numberOfPages){
                        paginationTemplate+=`<li id="lastPage" class="page-item page-number active "><p class="page-link pagination-item number-of-page">${idx}</p></li>`
                    }else{
                        paginationTemplate+=`<li class="page-item page-number active"><p class="page-link pagination-item number-of-page">${idx}</p></li>`
                    }
                    
                }else{
                    if(idx===numberOfPages){
                        paginationTemplate+=`<li id="lastPage" class="page-item page-number "><p class="page-link pagination-item number-of-page">${idx}</p></li>`
                    }else{
                        paginationTemplate+=`<li class="page-item page-number"><p class="page-link pagination-item number-of-page">${idx}</p></li>`
                    }
                    
                }   
            }
        }
        if(activeItem === numberOfPages){
                paginationTemplate+=
            `
            <li class="page-item">
                <span aria-hidden="true" class="page-link pagination-item page-last disabled" data-lastpage="${numberOfPages}">&raquo;</span>
            </li>
            `

        }else{
                paginationTemplate+=
            `
            <li class="page-item">
                <span aria-hidden="true" class="page-link pagination-item page-last" data-lastpage="${numberOfPages}">&raquo;</span>
            </li>
            `
        }
        

        



    paginationContainers.forEach(item=>{
        item.innerHTML=paginationTemplate
    })
                                    
}


function generatePerPageListeners(){
    let productsPerPage = document.getElementById("productsPerPage")

    productsPerPage.addEventListener("change",()=>{
        generateQueryString()
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)

        urlParams.set('page',1)

        window.history.replaceState({},'',`categories.html?${urlParams}`)
        generateProducts()
    })

}

function generatePaginationListeners(){
    let paginationContainers = document.querySelectorAll(".pagination")

    console.log(Array.from(paginationContainers))

    Array.from(paginationContainers).forEach(item=>{
        item.addEventListener('click',(event)=>{
            if((!event.target.parentElement.classList.contains('active'))&&(!event.target.classList.contains('disabled'))){
            Array.from(paginationContainers).forEach(item=>{
                Array.from(item.children).forEach(element=>{
                    if(element.classList.contains('active')){
                        element.remove('active')
                    }
                    
                })
            })
            if(event.target.classList.contains('number-of-page')){

                paginationContainers.forEach(item=>{
                    Array.from(item.children).forEach(element=>{
                        
                        if(element.firstChild.innerText===event.target.innerText){
                            element.classList.add('active')
                        }
                    })
                })
                generateQueryString()
                generateProducts()
            }
            if(event.target.classList.contains('page-first')||event.target.classList.contains('page-last')){
                event.preventDefault()
            }
            if(event.target.classList.contains('page-first')&&!event.target.classList.contains('disabled')){
                event.preventDefault()
                generateQueryString()
                generateProducts()
                
            }
            if(event.target.classList.contains('page-last')&&!event.target.classList.contains('disabled')){
                event.preventDefault()
                item.getElementsByClassName
                
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString)

                urlParams.set('page',Number(event.target.dataset.lastpage))

                window.history.replaceState({},'',`categories.html?${urlParams}`)
                generateProducts()
                
            }
        }

        })
    })

}

generateFilters()
generateCategories()
generatePerPageListeners()
generateMainCarousel()
generateProducts()

generateCart()
addNavBarLiteners()
addCategoriesListeners()
generateCartListeners()
generateCardListeners()
generateFiltersListeners()
generatePaginationListeners()
generatePriceListeners()
generateQueryString()