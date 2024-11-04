const shopContent = document.getElementById("shopContent"); // Elemento que contiene los productos
const cart = JSON.parse(localStorage.getItem('cart')) || []; // Carrito de compras, inicialmente vacío
const loginButton = document.getElementById('login-btn'); // Botón de inicio de sesión
const registerButton = document.getElementById('register-btn'); // Botón de registro
const userName = document.getElementById('user_name'); // Elemento para mostrar el nombre de usuario

// Agrega el evento de clic para el botón de inicio de sesión
if (loginButton != null && registerButton != null) {
    loginButton.addEventListener('click', () => {
        window.location.href = '../formLogin.html'; // Redirige a la página de inicio de sesión
    });

    // Agrega el evento de clic para el botón de registro
    registerButton.addEventListener('click', () => {
        window.location.href = '../formRegister.html'; // Redirige a la página de registro
    });
}

// Función para cargar productos desde la base de datos
const loadProducts = async () => {
    try {
        const response = await fetch('/products'); // Solicita los productos desde el servidor
        if (!response.ok) {
            throw new Error('Error al cargar los productos'); // Lanza un error si la respuesta no es ok
        }
        const productos = await response.json(); // Convierte la respuesta a formato JSON

        // Itera sobre cada producto y crea su representación en el DOM
        productos.forEach((product) => {
            const price = product.product_price.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'ARS'
            });

            const quotas = (product.product_price / 6).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'ARS'
            });

            const content = document.createElement("div");
            content.innerHTML = `
                <img src="${product.img}">
                <p>${product.product_name}</p> <!-- Nombre del producto -->
                <h4>${price} $</h4> <!-- Precio del producto -->
                <p1 id="quotas-p"><b>6</b> cuotas sin interés de <br></p1>
                <p1><b>${quotas}</b></p1>
            `;
            
            const buyButton = document.createElement("button");
            buyButton.innerText = "Comprar"; // Texto del botón de compra

            content.append(buyButton); // Agrega el botón al contenido del producto
            shopContent.append(content); // Agrega el contenido del producto al contenedor de la tienda

            // Agrega el evento de clic para el botón de compra
            buyButton.addEventListener("click", () => {
                const repeat = cart.some((repeatProduct) => repeatProduct.id === product.id); // Verifica si el producto ya está en el carrito

                if (repeat) {
                    cart.map((prod) => {
                        if (prod.id === product.id) {
                            prod.quanty++; // Incrementa la cantidad si el producto ya está en el carrito
                            displayCartCounter(); // Actualiza el contador del carrito
                        }
                    });
                } else {
                    // Si el producto no está en el carrito, lo agrega
                    cart.push({
                        id: product.id,
                        productName: product.product_name, // Nombre del producto
                        price: product.product_price, // Precio del producto
                        quanty: 1, // Inicializa la cantidad en 1
                        img: product.img,
                    });
                    displayCartCounter(); // Actualiza el contador del carrito
                    saveLocal(); // Guarda el carrito en localStorage
                }
            });
        });
    } catch (error) {
        console.error(error); // Muestra el error en consola si falla la carga de productos
    }
};

// Función para guardar el carrito en localStorage
const saveLocal = () => {
    localStorage.setItem('cart', JSON.stringify(cart)); // Guarda el carrito en formato JSON
}

// Evento que se dispara cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Array de rutas de las imágenes para el slider
    const imagenesBanner = [
        '../media/panel5.jpg',
        '../media/panel.jpg',
        '../media/panel2.jpg',
        '../media/panel3.jpg',
        '../media/panel4.jpg',
    ];

    const sliderTrack = document.getElementById('slider-track'); // Elemento que contiene el slider
    let indiceActual = 0; // Índice de la imagen actual

    // Crea los elementos del slider
    imagenesBanner.forEach((ruta) => {
        const sliderItem = document.createElement('div');
        const sliderBanner = document.createElement('div');
        sliderBanner.innerHTML = `
                <h1>Gaming Store</h1>
                <p>Tu tienda de juegos</p>`;
        sliderItem.classList.add('slider-item'); // Clase para los items del slider
        sliderItem.style.backgroundImage = `linear-gradient(to top, white 1%, rgba(255, 255, 255, 0) 60%), url(${ruta})`; // Establece la imagen de fondo
        sliderBanner.classList.add('banner-container'); // Clase para el contenedor del banner
        sliderTrack.appendChild(sliderItem); // Agrega el item al track del slider
        sliderItem.appendChild(sliderBanner); // Agrega el banner al item del slider
    });

    // Función para desplazar el slider lateralmente
    function cambiarImagen() {
        indiceActual = (indiceActual + 1) % imagenesBanner.length; // Incrementa el índice actual
        sliderTrack.style.transform = `translateX(-${indiceActual * 100}%)`; // Desplaza el track
    }

    // Cambia la imagen cada 5 segundos
    setInterval(cambiarImagen, 5000);
    
    // Llama a la función para establecer la primera imagen
    cambiarImagen();
});

// Carga los productos al inicio
loadProducts();

