
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

    let categoriesItems = document.getElementById("categories-items");
    let whereAmI = document.getElementById("whereAmI")
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
    let page = urlParams.get("page")?Number(urlParams.get("page")):1
    let perPage = urlParams.get("per-page")?Number(urlParams.get("per-page")):6


    console.log(perPage)
    console.log(page)
    console.log(producents)
    console.log(otherCategories)    
    console.log(chosenCategory)

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
            categoriesItems.innerHTML=output
            whereAmI.innerText =`Categories`
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


// async function generateProduct(){
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString)

//     let id= parseInt(urlParams.get("product-id"))


//     let productCarouselIndicator = document.getElementById("productCarouselIndicator")
//     let productCarouselInner = document.getElementById("productCarouselInner")
//     let productBody = document.getElementById("productBody")
//     let productSpec = document.getElementById("productSpec")
//     let sizesTemplate=""
//     let optionsTemplate=""
//     let productSpecTemplate=""
//     let productCarouselIndicatorTemplate=""
//     let productCarouselInnerTemplate=""
//     let price=""
//     await fetch(`http://localhost:3000/products/${id}`)
//     .then(res=>res.json())
//     .then(data=>{
//         price=data.priceDiscounted?`<p class="price-striked">${data.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>
//                                             <p class="fs-bigger">${data.priceDiscounted} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`:
//                                             `<p class="normal-price fs-bigger">${data.price} PLN <img src="svg\\add-to-cart.svg" class="card-cart" alt=""></p>`
                
//         data.option[1].values.forEach(item=>{
//            sizesTemplate+=
//             `
//             <option value="${item}">${item}</option>
//             `
//         })
//         data.option[0].values.forEach(item=>{
//             optionsTemplate+=
//             `
//             <option value="${item}">${item}</option>
//             `
          
//         })
//         data.specification.forEach(item=>{
//             productSpecTemplate+=
//             `
//             <div class="col-12 container-fluid   spec-item  productSpec">
//                 <div class="row m-0 p-0 w-100 ">
//                     <div class="col-0 col-md-2"></div>
//                     <div class="col-4 d-flex align-items-center p-0 "><h6 class="py-2 m-0">${item.name}</h6></div>
//                     <div class="col-8 col-md-6 d-flex align-items-center  p-0"><p>${item.value}</p></div>
//                 </div>
//             </div>
//             `
//         })
//         data.photos.forEach((item,index)=>{

//             if(index===0){
//                 productCarouselIndicatorTemplate+=`<li class="carousel-indicator" data-target="#carouselExampleIndicators" data-slide-to="${index}" class="active"></li>`
//                 productCarouselInnerTemplate+=
//                 `
//                 <div class="carousel-item active ">
//                   <img src="assets\\img\\${item}" class="d-block w-100 py-auto" alt="...">
//                 </div>
//                 `
//             }else{
//                 productCarouselIndicatorTemplate+=`<li class="carousel-indicator" data-target="#carouselExampleIndicators" data-slide-to="${index}" class=""></li>`
//                 productCarouselInnerTemplate+=
//                 `
//                 <div class="carousel-item">
//                   <img src="assets\\img\\${item}" class="d-block w-100 py-auto" alt="...">
//                 </div>
//                 `
//             }
//         })
        
        
//         productCarouselIndicator.innerHTML=productCarouselIndicatorTemplate
//         productCarouselInner.innerHTML=productCarouselInnerTemplate
//         productSpec.innerHTML=productSpecTemplate
//         productBody.innerHTML=
//             `
//             ${data.new?`<div class="col-4 col-sm-3 col-md-2 col-xl-2 bg-success d-flex align-items-center justify-content-center px-3 py-2  m-0 text-white rounded "><h5 class="p-0 m-0">NEW</h5></div>
//             `:``}
//             <h3 class="col-12 p-0 m-0 mt-5">${data.name}</h3>
//             <div class="col-12 p-0 my-3">${price}</div>
//             <p class="col-12 p-0 m-0 mb-4">${data.description}</p>
//             <h6 class="col-6   col-xl-4 p-0 m-0 mb-1">Size</h6>
//             <h6 class="col-6   col-xl-4 m-0 pl-2 mb-1">Color</h6>
//             <div class="col-0  col-xl-4"></div>
//             <h6 class="col-6   col-xl-4 p-0 m-0 ">
//                 <select id="productSizes" name="size">
//                 ${sizesTemplate}
//                 </select>
//             </h6>
//             <h6  class="col-6  col-xl-4 p-0 m-0 pl-2">
//                 <select id="productColours" name="color">
//                 ${optionsTemplate}
//                 </select>
//             </h6>
//             <div class="col-0 col-xl-4"></div>
//             <div class="col-12 p-0">
//                 <hr class="mx-0 p-0">
//             </div>
//             <div class=" col-10 col-lg-4 col-xl-5 pr-2 p-0 m-0">
//                 <button type="button" class="btn btn-primary btn-lg w-100">Add to cart</button>
//             </div>
//             <div class="col-2 col-lg-2 col-xl-1 p-0 m-0  d-flex align-items-center"> <input class="w-100  rounded border-1" type="number" value="1"></div>

//             `   
//     })
// }

async function addItemToCart(data){
    const payload = {
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
    try{
        await fetch("http://localhost:3000/cart",payload)
    }catch(e){
        console.log(e)
    }
    await generateCart()
}

const generateCardListeners=()=>{
    // const categoriesItems= document.getElementsByClassName("productCard");
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





    // const ItemCards= Array.from(categoriesItems)
    // ItemCards.forEach(item=>{
    //     item.addEventListener("click",(event)=>{
    //         if(event.target.classList.contains("card-cart")){
    //             event.preventDefault()
    //             addItemToCart(event.target.dataset)
    //         }
    //         if(event.target.classList.contains("card-heart")||event.target.classList.contains("card-heart-fav")){
    //             event.preventDefault()
    //             if(event.target.classList.contains("card-heart-fav")){
    //                 removeItemFromFav(event.target.dataset)
    //                 event.target.classList.remove("card-heart-fav")
    //                 event.target.classList.add("card-heart")
    //             }else{
    //                 addItemToFav(event.target.dataset)
    //                 event.target.classList.add("card-heart-fav")
    //                 event.target.classList.remove("card-heart")
    //             }
                
    //         }
    //     })
    // })

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
    const cartButtons= Array.from(document.getElementsByClassName("cartButton"));
    const cartBox = document.getElementById("cartBox")

    cartBox.addEventListener('click',(event)=>{
        if(event.target.classList.contains("cartButton")){
            event.target.dataset.id.split(",").forEach(item=>removeItemFromCart(item))
        }
    })
}

async function removeItemFromCart(id){
    
  
        // console.log(id)
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


// async function generateProducents(){
    

// let filtersProducerBox = document.getElementById("filtersProducerBox")
//     filtersProducerBox.innerHTML=`<div class="p-0 m-0">
//                                     <h6>Producer</h6>
//                                 </div>`;
//     fetch('http://localhost:3000/producers')
//     .then(res=>res.json())
//     .then(data=>{
//         data.forEach(item=>{
//             let newElement = document.createElement('div')
//             newElement.innerHTML=`
//                 <div class="p-0 m-0 mb-2 d-flex align-items-center">
//                     <input id="producer-${item.id}" type="checkbox" value="${item.id}" name="producents">
//                     <label for="producer-${item.id}">${item.name}</label>
//                 </div>
//                 `
//             filtersProducerBox.appendChild(newElement)
//         })
//     })
    
// }


// async function generateSaloons(){
    
//     let selectSaloon = document.getElementById("selectSaloon")
//     fetch("http://localhost:3000/saloons")
//     .then(res => res.json())
//     .then(data=>{
//         data.forEach(item=>{
//             selectSaloon.innerHTML+=`<option value="${item.name}">${item.name}</option>`
//         })
//     })

// }

// async function generateOtherCategories(){
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString)
//     let chosenCategory = parseInt(urlParams.get("category"))?parseInt(urlParams.get("category")):0

//     let otherOptions = document.getElementById("otherOptions")
//     otherOptions.innerHTML=` <div class=" p-0 m-0 d-flex align-items-center">
//                                 <h6>Other options</h6>
//                             </div>`

//     await fetch(`http://localhost:3000/options?category=${chosenCategory}`)
//     .then(res => res.json())
//     .then(data=>{
//         data.forEach(item=>{
//             if(item.type==="single"){
//                 let newElement = document.createElement('div')
//                 newElement.innerHTML=
//                 `
//                 <div class=" p-0 m-0 mb-2 d-flex align-items-center">
//                     <input id="${item.label}" type="checkbox" name="otherCategories">
//                     <label for="${item.label}">${item.label}</label>
//                 </div>
//                 `
//                 otherOptions.appendChild(newElement)
//             }

//         })
//     })


//     let newElement = document.createElement("div")
//     let filterButton = document.createElement("button")
//     filterButton.classList.add('btn','btn-primary')
//     filterButton.innerText="Filter"
//     filterButton.addEventListener('click',()=>{
//         let filterOptions = document.querySelectorAll("input[name='producents']")

//         // document.querySelectorAll("input[name='producents']").forEach(item=>console.log(item.checked))

//         const queryString = window.location.search;
//         let queryParams = new URLSearchParams(queryString)
//         queryParams.delete("producents")
//         filterOptions.forEach(item=>{
//             if(item.checked){
//                 queryParams.append("producents",parseInt(item.value))
//             }
//         })
        

//         let urlTemplate  = queryParams.toString()

//         window.location.href=`http://localhost:5500/categories.html?${urlTemplate}`
        
//     })
//     newElement.appendChild(filterButton)
//     otherOptions.appendChild(newElement)
// }


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
            selectSaloon.innerHTML+=`<option value="${item.name}">${item.name}</option>`
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
        if((event.target.name==="producents")||(event.target.name==="producents")){
            generateQueryString()
            generateProducts()
        }
        
    })
    // producents.forEach(item=>{
    //     item.addEventListener('change',()=>{
    //         
    //     })
    // })
    // otherCategories.forEach(item=>{
    //     item.addEventListener('change',()=>{
    //         generateQueryString()
    //         generateProducts()
    //     })
    // })

}



function generateQueryString(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    let chosenCategory = parseInt(urlParams.get("category"))?parseInt(urlParams.get("category")):0

    let producents = document.querySelectorAll("input[name='producents']")
    let otherCategories = document.querySelectorAll("input[name='otherCategories']")
    let productsPerPage = document.getElementById("productsPerPage")
    let page = document.querySelector(".pagination")
    let pageNumber = page.querySelector('.active')?Number(page.querySelector('.active').firstChild.innerText):1

    const urlNewParams = new URLSearchParams()


    if(chosenCategory!==0){
        urlNewParams.append("category",chosenCategory)
    }
    urlNewParams.append("page",pageNumber)

    if(Number(productsPerPage.value)){
        urlNewParams.append("per-page",Number(productsPerPage.value))
    }
    
    
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

    window.history.replaceState({},'',`categories.html?${urlNewParams}`)

}

async function generateCart(){
    let cartBox = document.getElementById("cartBox")
    let cart = document.getElementById("cart")
    let total=0;
    let cartBoxTemplate=""


    cartBox.innerHTML=""
    await fetch("http://localhost:3000/cart")
    .then(res=>res.json())
    .then(data=>{
        const cartMap = new Map()

        data.forEach((item)=>{
            if(cartMap.get(item.productId)){
 
                cartMap.get(item.productId).price+=item.priceDiscounted?(item.priceDiscounted*item.qty):(item.price*item.qty)
                cartMap.get(item.productId).qty+=item.qty
                cartMap.get(item.productId).id.push(item.id)
            }else{
            cartMap.set(item.productId,{name:item.name,thumbnail:item.thumbnail,qty:item.qty,price:item.priceDiscounted?(item.priceDiscounted*item.qty):(item.price*item.qty),id:[item.id]})
            }
        })



        cartMap.forEach(item=>{
            total+=item.price
            cartBoxTemplate+=`<div class="row container-fluid w-100 cart-item  px-0 ml-auto mr-0">
            <div class="col-2 p-0 m-0">
                <div class="w-100">    
                    <div class="image-container">
                        <img src="assets\\img\\${item.thumbnail}" class="cart-img w-100 h-100" alt="...">
                        <div class="productCounter">${item.qty}x</div>
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
            <div class="cartCounter">${data.length}</div>
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
    // let numberOfPages = paginationContainers[0].dataset.numberOfPages
    console.log(numberOfPages)
    let paginationTemplate=""

    let idx = 1
         paginationTemplate+=
         `
         <li class="page-item">
            <a class="page-link pagination-item" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        `
        for(let idx=activeItem-1;idx<activeItem+2;idx++){
            if(idx>0&&idx<=numberOfPages){
                if(idx===activeItem){
                    paginationTemplate+=`<li class="page-item page-number active"><p class="page-link pagination-item">${idx}</p></li>`
                }else{
                    paginationTemplate+=`<li class="page-item page-number"><p class="page-link pagination-item">${idx}</p></li>`
                }   
            }
        }

        paginationTemplate+=
        `
        <li class="page-item">
            <a class="page-link pagination-item" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
        `

        



    paginationContainers.forEach(item=>{
        item.innerHTML=paginationTemplate
    })
    generatePaginationListeners()                                
}


function generatePerPageListeners(){
    let productsPerPage = document.getElementById("productsPerPage")
    productsPerPage.addEventListener("change",()=>{
        generateQueryString()
        generateProducts()
        // generateProducts()
        // generatePagination()
    })

}

function generatePaginationListeners(){
    let page = document.getElementById("page")
    // let paginationItems = Array.from(page.children)
    
    page.addEventListener('click',(event)=>{
        // console.log(event.target.parentElement)
        
        Array.from(page.children).forEach(item=>{
            if((item.classList.contains("page-number"))&&(item.classList.contains("active"))){
                item.classList.remove("active")
                
            }
        })
        event.target.parentElement.classList.add("active")
        if(event.target.classList.contains("pagination-item")){
            generateQueryString()
            generateProducts()
        }
    })

}


// generateProduct(1)


generateFilters()
generatePerPageListeners()
generateMainCarousel()
generateProducts()
generatePagination()
generateCategories()
// generateProducents()
// generateSaloons()
// generateOtherCategories()
generateCart()
addNavBarLiteners()
addCategoriesListeners()
generateCartListeners()
generateCardListeners()
generateFiltersListeners()
