
// globals
const productSection = document.getElementById('featuredProducts');
const navElement = document.getElementById('navigation');



let myProducts = null


// page load
GetProductData()
GetCategoryData()


/* Model code------------------------------------------------------------- */

function GetProductData() {

    fetch('https://dummyjson.com/products?limit=100')

        .then((result) => {
            //console.log(result);
            return result.json()
        }
        )

        .then((json) => {
            console.log(json);
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





/* controller code------------------------------------------------------------- */

function recivedProductsByCategory(productsByC) {

    let myProductArray = productsByC.products

    CreateProductView(myProductArray)

}



function CategoryRecived(CategoryData) {
    // skriv lækker kode der kan sortere kategorier her.. nu sender vi bare alt videre.
    // console.log(CategoryData);

    CreateNavBar(CategoryData)
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
    console.log(CategoryName);
    /*   // vi har Data
  
      let myCategoryProducts = []
  
      myProducts.forEach(product => {
          if (product.category == CategoryName) {
              myCategoryProducts.push(product)
          }
      });
      
    CreateProductView(myCategoryProducts)
     */


    // get data from API  bug API url og send videre
    let myCategoryURL = `https://dummyjson.com/products/category/${CategoryName}`

    GetProductsByCategory(myCategoryURL)




}

//



//----------------------------------------------------------------------
function ProductCallback(myId) {



    console.log(myId);
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
        console.log(myClickedProduct)
        clearApp();
        buildProduct(myClickedProduct)

    }

}


/* view code------------------------------------------------------------- */

function CreateNavBar(Categorydata) {

    let myNavHTML = ""

    Categorydata.forEach(categoryName => {

        let myButton = `<button onclick="NavCallback('${categoryName}')" >${categoryName}</button>`
        myNavHTML += myButton
    });

    navElement.innerHTML = myNavHTML

}

//----------------------------------------------------------------------
function CreateProductView(myCards) {
    //console.log(myCards);
    clearApp()

    myCards.forEach(product => {
        // console.log(product);


        let myHTML = `<figure onclick="ProductCallback(${product.id})" ><h2>${product.title}</h2><img src="${product.thumbnail}"><h3>PRIS: ${product.price} rabat: ${product.discountPercentage}</h3></figure>`


        productSection.innerHTML += myHTML
    })
}


//----------------------------------------------------------------------
function buildProduct(product) {

    let myHTML = `<figure class="productDetails" onclick="GetProductData()" ><h2>${product.title}</h2>
  
    <img src="${product.images[0]}">
    <img src="${product.images[2]}">
    <img src="${product.images[3]}">
    <h3>PRIS: ${product.price}</h3>
    <p>${product.description}</p>
    </figure>
    `


    productSection.innerHTML = myHTML
}


//----------------------------------------------------------------------
function clearApp() {
    productSection.innerHTML = ""
}



