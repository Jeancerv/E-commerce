let items = [
    {
        id: "0",
        name: "Hoodies",
        stock: 10,
        price: 14,
        urlImage: "img/featured2.png"
    },
    {
        id: "1",
        name: "Hoodies Rocky",
        stock: 15,
        price: 14,
        urlImage: "img/featured3.png"
    },
    {
        id: "2",
        name: "Swatshirts",
        stock: 8,
        price: 24,
        urlImage: "img/featured1.png"
    },
    
]






items = JSON.parse(localStorage.getItem("items")) || items;
let objCart = JSON.parse(localStorage.getItem("objCart")) || {};



const navAnimacion = document.querySelector('.header__navbar');
const contentCart = document.querySelector(".contentCart");
const bodyContenedor = document.querySelector(".container");
const iconoCarro = document.querySelector('.bx-shopping-bag');
const modeLight = document.querySelector('.bx-moon');
const iconX = document.querySelector('.bx-x');



iconX.addEventListener('click', () => {
    contentCart.classList.toggle("contentCart__show")
})


iconoCarro.addEventListener('click',function(){
    contentCart.classList.toggle("contentCart__show")
})


modeLight.addEventListener('click',function(){
    bodyContenedor.classList.toggle("luz")
})


const S = window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
        navAnimacion.classList.add('header__navbar-animation');
    } else {
        navAnimacion.classList.remove('header__navbar-animation');
    }
});

    



const cartTotal = document.querySelector('.cartTotal');
const cartAmount =document.querySelector('.cartAmount');
const productos = document.querySelector('.productos__detalles');
const cartProduct = document.querySelector('.cartProduct');


printproductosInCart();



function searchProduct(id){
    return items.find(function(item){
        return item.id === id;
    });
}

function deleteProduct(id){
    const respuesta = confirm("Esta seguro de eliminar este producto?")
            if (respuesta) delete objCart[id];
}


function verifyAddToCart(findProduct, id){
    if(findProduct.stock === objCart[id].amount) {
        alert("Lo sentimos, este producto no esta disponible");
    } else {
        objCart[id].amount++;
    }
}


function printCartAmount() {
    let sum = 0;


    const arraycarro = Object.values(objCart);


    if(!arraycarro.length) {
        cartAmount.style.display = "none";
        return;
    };


    cartAmount.style.display = "inline-block";

    arraycarro.forEach(function ({ amount }){
        sum += amount;
    });

    cartAmount.textContent = sum;
}



function printTotalCart() {
    const arraycarro = Object.values(objCart);
    if(!arraycarro.length) {
        cartTotal.innerHTML = `
        <section class="cartProductempty flex">
            <img src="./img/png-transparent-shopping-bags-trolleys-shopping-cart-empty-cart-text-logo-shopping-bags-trolleys.png" alt="Empty">
        </section>
        <h3>Tu carrito está vacío</h3>
        `;

        return;
    }

    let sum = 0;

    arraycarro.forEach(function ({ amount, price }) {
        sum += amount * price;
    });



    cartTotal.innerHTML = `
        <h3>Total to pay ${sum}.00</h3>
        <br/>
        <button class="btn btn__buy">Buy</button>
    `
}

function printproductosInCart() {
    let html = '';

    const arraycarro = Object.values(objCart);

    arraycarro.forEach(function({id, name, price, urlImage, amount}){
        html += `
            <section class="product">    
                <section class="product__img">
                    <img src="${urlImage}" alt"${name}" />
                </section>
                <section class="product__info">
                    <p>${name}</p>
                    <p>${price}.00</p>
                    <p>amount: ${amount}</p>
                </section>
                <section class="product_options" id="${id}">
                    <i class='bx bx-minus'></i>
                    <i class='bx bx-plus'></i>
                    <i class='bx bx-trash' ></i>
                </section>
            </section>
        `
    });
    

    cartProduct.innerHTML = html;
}

function printproductos(){
    let html = '';

    items.forEach(function({id, name, stock, price, urlImage}){
        html += `
        <section class="productos__detalles-img filter-${id}">
        <img src="${urlImage}" alt"${name}">
        <section class="productos__detalles-img-details">
            <section class="productos__detalles-img-details-title flex">
                <h3 class="productos__detalles-price">${price}.00</h3>
                <p class="categories-details"><small> | Stock: ${stock} </small></p>
            </section>
            <section class="paragraph">
                <h3 class="productos__detalles-price-name">${name}</h3>
            </section>
        </section>
        <section class="product_options" id="${id}">
            <button class="btn btn__add">AÑADIR AL CARRO</button>
        </section>
    </section>
    `
    });

    productos.innerHTML = html;
}

productos.addEventListener('click', function(e){
    if(e.target.classList.contains('btn__add')){
        
        const id = e.target.parentElement.id;

        
        let findProduct = searchProduct(id)

        if(findProduct.stock === 0) return alert("Agotado")

        
        if(objCart[id]){
            verifyAddToCart(findProduct, id)
        }else{
            objCart[id] = {
                ...findProduct,
                amount: 1
            }
        }

        localStorage.setItem("objCart", JSON.stringify(objCart));
    }
    
    printproductosInCart();
    printTotalCart();
    printCartAmount();
});

cartProduct.addEventListener('click', function (e) {

    if (e.target.classList.contains("bx-minus")) {
        const id = e.target.parentElement.id;
        
        if (objCart[id].amount === 1) {
            deleteProduct(id)
        } else {
            objCart[id].amount--;
        }
    }

    if (e.target.classList.contains("bx-plus")) {
        const id = e.target.parentElement.id;
        let findProduct = searchProduct(id)
        verifyAddToCart(findProduct, id)
    }

    if (e.target.classList.contains("bx-trash")) {
        const id = e.target.parentElement.id;
        
        deleteProduct(id)
    }

    localStorage.setItem("objCart", JSON.stringify(objCart));

    printproductosInCart();
    printTotalCart();
    printCartAmount();
});




cartTotal.addEventListener('click', function(e) {
    if(e.target.classList.contains("btn__buy")) {
        const respuesta = confirm("Confirmar la compra")

        if (!respuesta) return;
        
        let newArray = [];

        items.forEach(function(item) {
            if (item.id === objCart[item.id]?.id) {
                newArray.push({
                    ...item,
                    stock: item.stock - objCart[item.id].amount,
                });
            } else {
                newArray.push(item);
            }
        });

        items = newArray;
        objCart = {};

        localStorage.setItem("objCart", JSON.stringify(objCart));
        localStorage.setItem("items", JSON.stringify(items));

        printproductos();
        printproductosInCart();
        printTotalCart();
        printCartAmount();
        darkMode(iconoCarro, modeLight, iconX);
    };
});


printproductos();
printTotalCart();
printCartAmount();



