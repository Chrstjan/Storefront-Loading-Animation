
// globals
const productSection = document.getElementById('app');
const navElement = document.getElementById('navigation')
const basketIcon = document.getElementById('basketIcon')




let myProducts = null



// page load
InitApp()



/* Model code------------------------------------------------------------- */

function GetProductData() {

    fetch('https://dummyjson.com/products?limit=100')

        .then((result) => {
            //console.log(result);
            return result.json()
        }
        )

        .then((json) => {
            //console.log(json);
            ProductsRecived(json)
        });
}


function GetProductsByCategory(myCategoryURL) {

    fetch(myCategoryURL)

        .then((result) => {
            //console.log(result);
            return result.json()
        }
        )

        .then((json) => {



            recivedProductsByCategory(json)
        });

}


function GetCategoryData() {

    fetch('https://dummyjson.com/products/categories')

        .then((result) => {
            return result.json()
        }
        )

        .then((json) => {
            //console.log(json);
            CategoryRecived(json)
        });
}



function SaveBasketData(basketData) {
    let mySerializedData = JSON.stringify(basketData)
    localStorage.setItem('myBasket', mySerializedData)
}


function ReadLocalStorageData() {

    let mybasketstring = localStorage.getItem('myBasket')
    // @ts-ignore
    let myBasket = JSON.parse(mybasketstring)
    return myBasket
}


/* controller code------------------------------------------------------------- */



function InitApp() {
    buildLoadingScreen();
    InitializeBasket()
    GetProductData()
    GetCategoryData()

}


// breakpoint detection
addEventListener("resize", resizeCheck);

function resizeCheck() {
    if (window.innerWidth < 600) {

        let navIcon = document.getElementById('navIcon')


        if (navIcon.classList.contains("hidden")) {
            ShowMobileNav();
        }


    } else {

        let navIcon = document.getElementById('navIcon')


        if (!navIcon.classList.contains("hidden")) {
            HideMobileNav()
        }

    }
}


function recivedProductsByCategory(productsByC) {

    let myProductArray = productsByC.products

    CreateProductView(myProductArray)

}



function CategoryRecived(CategoryData) {
    // hoved kategori arrays
    let myElectronics = []
    let myCosmetics = []
    let myVehicles = []
    let womensFashion = []
    let mensFashion = []
    let myMisc = []

    CategoryData.forEach(category => {

        switch (category) {

            case 'laptops':
            case 'lighting':
            case 'smartphones':

                myElectronics.push(category)
                break;

            case 'fragrances':
            case 'skincare':
                myCosmetics.push(category)

                break;

            case 'automotive':
            case 'motorcycle':
                myVehicles.push(category)

                break;

            case 'tops':
            case 'womens-dresses':
            case 'womens-shoes':
            case 'womens-watches':
            case 'womens-bags':
            case 'womens-jewellery':

                womensFashion.push(category)

                break;

            case 'tops':
            case 'mens-shirts':
            case 'mens-shoes':
            case 'mens-watches':
                mensFashion.push(category)

                break;

            default:

                myMisc.push(category)
                break;
        }

    });

    // add all to misc
    myMisc.push('All')

    // build datastructure to view code
    let myNavigationData = [
        {
            superCategoryname: 'Electronics',
            subCategories: myElectronics
        },
        {
            superCategoryname: 'Cosmetics',
            subCategories: myCosmetics
        },
        {
            superCategoryname: 'Vehicles',
            subCategories: myVehicles
        },
        {
            superCategoryname: 'mens fashion',
            subCategories: mensFashion
        },
        {
            superCategoryname: 'womans fashion',
            subCategories: womensFashion
        },
        {
            superCategoryname: 'misc',
            subCategories: myMisc
        }

    ]



    CreateNavBar(myNavigationData)
}

//----------------------------------------------------------------------
function ProductsRecived(productData) {

    //console.log(productData)

    myProducts = productData.products

    let myFeaturedProducts = [];

    myFeaturedProducts.push(myProducts[8], myProducts[29], myProducts[19])
    //console.log(myFeaturedProducts);

    CreateProductView(myFeaturedProducts)
    // CreateProductView(myProducts)
}

//----------------------------------------------------------------------

function NavCallback(CategoryName) {
    //console.log(CategoryName);
    CloseMobileNav()
    buildLoadingScreen();
    // get data from API  bug API url og send videre
    if (CategoryName == "All") {
        CreateProductView(myProducts)
    }
    else {
        let myCategoryURL = `https://dummyjson.com/products/category/${CategoryName}`

        GetProductsByCategory(myCategoryURL)
    }



}

//----------------------------------------------------------------------

function ProductCallback(myId) {


    //console.log(myId);
    let myClickedProduct = null


    myProducts.forEach(product => {

        if (product.id == myId) {
            myClickedProduct = product
        }
    }
    )

    if (myClickedProduct == null) {
        // ingen produkt
        alert('no product')
    }
    else {
        // produkt
        //console.log(myClickedProduct)
        clearApp();
        buildProduct(myClickedProduct)

    }

}

//----------------------------------------------------------------------

function LogoCallback() {
    buildLoadingScreen();
    GetProductData()
}

//----------------------------------------------------------------------

function InitializeBasket() {
    //myBasket
    let myBasket = localStorage.getItem('myBasket')

    if (!myBasket) {
        console.log('no basket');

        let newBasket = {
            products: [],
            total: 0
        }


        UpdateBasketIcon(0)

        /*    let mySerializedData = JSON.stringify(newBasket)
   
           localStorage.setItem('myBasket', mySerializedData) */

        SaveBasketData(newBasket)

    } else {

        let myData = JSON.parse(myBasket)

        UpdateBasketIcon(myData.products.length)

    }

}




//----------------------------------------------------------------------

function AddToBasket(productId) {


    let myBasket = ReadLocalStorageData()


    myBasket.products.push(productId);

    UpdateBasketIcon(myBasket.products.length)

    /*  let mySerializedData = JSON.stringify(myBasket)
     localStorage.setItem('myBasket', mySerializedData) */

    SaveBasketData(myBasket)
}

//----------------------------------------------------------------------

function BasketIconCallback() {
    /*  let mybasketstring = localStorage.getItem('myBasket')
     let myBasket = JSON.parse(mybasketstring) */
    let myBasket = ReadLocalStorageData()


    let myProducts = []

    myBasket.products.forEach(productId => {
        let myProduct = getProduct(productId)
        if (myProduct) {

            myProducts.push(myProduct)
        }
    });

    BuildBasket(myProducts)
}

//----------------------------------------------------------------------

function BasketRemove(id) {


    /*  let mybasketstring = localStorage.getItem('myBasket')
     let myBasket = JSON.parse(mybasketstring) */
    let myBasket = ReadLocalStorageData()

    myBasket.products.forEach((productId, index) => {
        if (id == productId) {
            myBasket.products.splice(index, 1)
            return;
        }
    });
    /* 
        let mySerializedData = JSON.stringify(myBasket)
        localStorage.setItem('myBasket', mySerializedData) */

    SaveBasketData(myBasket)

    BasketIconCallback()
}

//----------------------------------------------------------------------


function paymentCallBack() {
    alert('weee i am getting paid');
}

//----------------------------------------------------------------------

function BasketClear() {
    let newBasket = {
        products: [],
        total: 0
    }
    UpdateBasketIcon(0)
    /*   mySerializedData = JSON.stringify(newBasket)
      localStorage.setItem('myBasket', mySerializedData) */

    SaveBasketData(newBasket)

    BasketIconCallback()
}

// helper functions
//----------------------------------------------------------------------
//----------------------------------------------------------------------


function getProduct(id) {
    let myProduct = false
    myProducts.forEach(product => {
        if (id == product.id) {
            myProduct = product
        }
    });

    return myProduct
}

function ToggleMenu() {
    let myMenues = document.getElementById('menuLists')
    myMenues.classList.toggle('hidden')

}


/* view code------------------------------------------------------------- */

function buildLoadingScreen() {
    //Html Css Animation
    // let loadingAnimation = `
    // <div class="animation-container">
    //     <div class="spin-animation"></div>
    //     <h2>Loading...</h2>
    // </div>`;

    //Svg Animation
    // let loadingAnimation = `<?xml version="1.0" encoding="utf-8"?>
    // <svg version="1.1" id="Dots" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    //      viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
    // <g id="dotThree">
    //     <circle cx="136.5" cy="241.5" r="45"/>
    //     <path d="M136.5,197c24.54,0,44.5,19.96,44.5,44.5c0,24.54-19.96,44.5-44.5,44.5S92,266.04,92,241.5C92,216.96,111.96,197,136.5,197
    //          M136.5,196c-25.13,0-45.5,20.37-45.5,45.5s20.37,45.5,45.5,45.5s45.5-20.37,45.5-45.5S161.63,196,136.5,196L136.5,196z"/>
    // </g>
    // <g id="dotTwo">
    //     <circle cx="244.5" cy="241.5" r="45"/>
    //     <path d="M244.5,197c24.54,0,44.5,19.96,44.5,44.5S269.04,286,244.5,286S200,266.04,200,241.5S219.96,197,244.5,197 M244.5,196
    //         c-25.13,0-45.5,20.37-45.5,45.5s20.37,45.5,45.5,45.5s45.5-20.37,45.5-45.5S269.63,196,244.5,196L244.5,196z"/>
    // </g>
    // <g id="dotOne">
    //     <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 -66.6428 322.1101)" cx="355.5" cy="241.5" rx="45" ry="45"/>
    //     <path d="M355.5,197c24.54,0,44.5,19.96,44.5,44.5c0,24.54-19.96,44.5-44.5,44.5S311,266.04,311,241.5
    //         C311,216.96,330.96,197,355.5,197 M355.5,196c-25.13,0-45.5,20.37-45.5,45.5c0,25.13,20.37,45.5,45.5,45.5s45.5-20.37,45.5-45.5
    //         C401,216.37,380.63,196,355.5,196L355.5,196z"/>
    // </g>
    // </svg>
    // `;

    let loadingAnimation = `<dotlottie-player src="./assets/lottie/products.json" background="transparent" speed="1.4" style="width: 300px; height: 300px" direction="1" playMode="normal" loop autoplay></dotlottie-player>`
 
    productSection.innerHTML = loadingAnimation;
    // productSection.appendChild(container);
}

function ShowMobileNav() {

    let navIcon = document.getElementById('navIcon')
    let navBox = document.getElementById('menuLists')

    if (navIcon.classList.contains("hidden")) {
        navIcon.classList.toggle('hidden')
        navBox.classList.toggle('hidden')
    }
}

function CloseMobileNav() {
    if (window.innerWidth < 600) {
        let navBox = document.getElementById('menuLists')


        if (!navBox.classList.contains("hidden")) {
            navBox.classList.toggle('hidden')
        }

    }

}

function HideMobileNav() {
    let navIcon = document.getElementById('navIcon')
    let navBox = document.getElementById('menuLists')


    if (window.innerWidth > 600) {
        if (!navIcon.classList.contains("hidden")) {
            navIcon.classList.toggle('hidden')
            navBox.classList.toggle('hidden')
        }

    }


}


function BuildBasket(products) {
    clearApp()

    let myBasketHTML = '<section id="basketWiev">'
    if (products.length > 0) {
        products.forEach(product => {
            // console.log(product);

            let myHTML = `<figure><img src="${product.thumbnail}"><h2>${product.title}</h2><p>PRIS: ${product.price}</p><button onclick="BasketRemove(${product.id})">remove</button></figure>`


            myBasketHTML += myHTML
        })
        myBasketHTML += `<section id="basketTools"><button onclick="paymentCallBack()">Go to payment</button><button onclick="BasketClear()">clear basket</button></section>`
    } else {
        myBasketHTML += `<h1>basket empty go buy stuff</h1><button onclick="GetProductData()">OK</button>`

    }

    myBasketHTML += '</section>'

    productSection.innerHTML = myBasketHTML
}


function UpdateBasketIcon(items) {

    let myUpdateElement = document.getElementById('basketProductText')
    myUpdateElement.innerHTML = items

}

function CreateNavBar(Categorydata) {

    navElement.innerHTML = ''

    let navHTML = ' <img id="navIcon" class="hidden" onClick="ToggleMenu()" src="assets/img/burger.svg"><section id="menuLists" class="menuListsLook">'


    Categorydata.forEach(superCatData => {

        // ul from category array

        let mySubCats = '<ul>'
        superCatData.subCategories.forEach(subCatName => {
            let myListElement = `<li><div class="navRollover"onClick="NavCallback('${subCatName}')">${subCatName}</div></li>`
            mySubCats += myListElement
        });
        mySubCats += '</ul>'

        //console.log(mySubCats);
        //console.log(superCat.superCategoryname);
        navHTML += `<div class="navCategories"><h3>${superCatData.superCategoryname}</h3>
        ${mySubCats}
        </div>`

    });

    navHTML += '</section>'

    navElement.innerHTML += navHTML
    resizeCheck()
}

//----------------------------------------------------------------------
function CreateProductView(myCards) {
    //console.log(myCards);
    clearApp()

    let myHTML = '<section id="featuredProducts">'

    myCards.forEach(product => {
        // console.log(product);

        myHTML += `<figure><h2>${product.title}</h2><img onclick="ProductCallback(${product.id})" src="${product.thumbnail}"><h3>PRIS: ${product.price} rabat: ${product.discountPercentage}</h3>
         <button onclick="AddToBasket(${product.id})" >add to basket</button>
        </figure>`

    })

    myHTML += '</section>'

    productSection.innerHTML = myHTML
}


//----------------------------------------------------------------------
function buildProduct(product) {

    let myHTML = `<section class="productDetails"><figure><h2>${product.title}</h2>
  
    <img src="${product.images[0]}">
    <img src="${product.images[2]}">
    <img src="${product.images[3]}">
    <h3>PRIS: ${product.price}</h3>
    <p>${product.description}</p>
    <button onclick="AddToBasket(${product.id})" >add to basket</button>
    </figure></section>
    `


    productSection.innerHTML = myHTML
}


//----------------------------------------------------------------------
function clearApp() {
    productSection.innerHTML = ""

}



