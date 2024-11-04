// Obtener referencias a los elementos del DOM
const modalContainer = document.getElementById("modal-container"); // Contenedor del modal del carrito
const modalOverlay = document.getElementById("modal-overlay"); // Capa de superposición del modal

const cartBtn = document.getElementById("cart-btn"); // Botón que muestra el carrito
const cartCounter = document.getElementById("cart-counter"); // Contador de productos en el carrito

// Función para mostrar el carrito
const displayCart = () => {
    modalContainer.innerHTML = ""; // Limpiar el contenido del modal
    modalContainer.style.display = "block"; // Mostrar el modal
    modalOverlay.style.display = "block"; // Mostrar la superposición

    // Encabezado del modal
    const modalHeader = document.createElement("div");
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌"; // Ícono de cierre
    modalClose.className = "modal-close";
    modalHeader.append(modalClose); // Agregar el botón de cerrar al encabezado

    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none"; // Ocultar el modal al hacer clic en cerrar
        modalOverlay.style.display = "none"; // Ocultar la superposición
    });

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Carrito"; // Título del modal
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle); // Agregar el título al encabezado

    modalContainer.append(modalHeader); // Agregar el encabezado al contenedor del modal

    // Cuerpo del modal
    if (cart.length > 0) { // Verificar si hay productos en el carrito
        cart.forEach((product) => {
            const modalBody = document.createElement("div");
            modalBody.className = "modal-body"; // Clase para el cuerpo del modal
            modalBody.innerHTML = `
                <div class="product">
                    <img class="product-img" src="${product.img}" /> <!-- Imagen del producto -->
                    <div class="product-info">
                        <h4>${product.productName}</h4> <!-- Nombre del producto -->
                    </div>
                    <div class="quantity">
                        <span class="quantity-btn-decrese">-</span> <!-- Botón de disminuir cantidad -->
                        <span class="quantity-input">${product.quanty}</span> <!-- Cantidad del producto -->
                        <span class="quantity-btn-increse">+</span> <!-- Botón de aumentar cantidad -->
                    </div>
                    <div class="price">${product.price * product.quanty}</div> <!-- Precio total del producto -->
                    <div class="delete-product">❌</div> <!-- Botón para eliminar el producto -->
                </div>
            `;
            modalContainer.append(modalBody); // Agregar el cuerpo del producto al contenedor del modal

            // Disminuir cantidad
            const decrese = modalBody.querySelector(".quantity-btn-decrese");
            decrese.addEventListener("click", () => {
                if (product.quanty !== 1) { // Asegurarse de que la cantidad no sea menor a 1
                    product.quanty--; // Disminuir la cantidad
                    displayCart(); // Actualizar la visualización del carrito
                    displayCartCounter(); // Actualizar el contador del carrito
                }
            });

            // Aumentar cantidad
            const increse = modalBody.querySelector(".quantity-btn-increse");
            increse.addEventListener("click", () => {
                product.quanty++; // Aumentar la cantidad
                displayCart(); // Actualizar la visualización del carrito
                displayCartCounter(); // Actualizar el contador del carrito
            });

            // Eliminar producto
            const deleteProduct = modalBody.querySelector(".delete-product");
            deleteProduct.addEventListener("click", () => {
                deleteCartProduct(product.id); // Llamar a la función para eliminar el producto del carrito
            });
        });

        // Pie del modal
        const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0); // Calcular el total del carrito

        const modalFooter = document.createElement("div");
        modalFooter.className = "modal-footer";
        modalFooter.innerHTML = `
            <div class="total-price">Total: ${total}</div>
            <button class="btn-primary" id="checkout-btn"> Ir a pagar </button>
            <div id="button-checkout"></div>   
        `;
        modalContainer.append(modalFooter); // Agregar el pie al contenedor del modal

        // Configuración de MercadoPago
        const mercadopago = new MercadoPago("APP_USR-a7933208-f18a-4598-8fbb-8c0e63391021", {
            locale: "es-AR", 
        });

        const checkoutButton = modalFooter.querySelector("#checkout-btn");

        // Evento de clic para el botón de pago
        checkoutButton.addEventListener("click", function () {
            checkoutButton.remove(); // Remover el botón de pago después de hacer clic

            const orderData = {
                quantity: 1,
                description: "compra de ecommerce",
                price: total, // Enviar el total al backend
            };

            fetch("/create_preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData), // Convertir los datos a JSON
            })
                .then(function (response) {
                    return response.json(); // Convertir la respuesta a JSON
                })
                .then(function (preference) {
                    createCheckoutButton(preference.id); // Crear el botón de pago con la preferencia
                })
                .catch(function () {
                    alert("Error inesperado"); // Manejar errores
                });
        });

        // Función para crear el botón de pago
        function createCheckoutButton(preferenceId) {
            const bricksBuilder = mercadopago.bricks();

            const renderComponent = async (bricksBuilder) => {
                await bricksBuilder.create(
                    "wallet",
                    "button-checkout", // ID donde se mostrará el botón de pago
                    {
                        initialization: {
                            preferenceId: preferenceId,
                        },
                        callbacks: {
                            onError: (error) => console.error(error), // Manejar errores
                            onReady: () => {},
                        },
                    }
                );
            };
            window.checkoutButton = renderComponent(bricksBuilder);
        }

    } else {
        const modalText = document.createElement("h2");
        modalText.className = "modal-text";
        modalText.innerText = "El carrito está vacío"; // Mensaje cuando el carrito está vacío
        modalContainer.append(modalText); // Agregar mensaje al contenedor del modal
    }
};

// Evento de clic para mostrar el carrito
cartBtn.addEventListener("click", displayCart);

// Función para eliminar un producto del carrito
const deleteCartProduct = (id) => {
    const foundId = cart.findIndex((element) => element.id === id); // Buscar el índice del producto
    cart.splice(foundId, 1); // Eliminar el producto del carrito
    displayCart(); // Actualizar la visualización del carrito
    saveLocal(); // Guardar el carrito en localStorage
    displayCartCounter(); // Actualizar el contador del carrito
}

// Función para mostrar el contador de productos en el carrito
const displayCartCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0); // Calcular el número total de productos
    localStorage.setItem('cartLength', JSON.stringify(cartLength)); // Guardar la longitud del carrito en localStorage

    if (cartLength > 0) {
        cartCounter.style.display = "grid"; // Mostrar el contador
        cartCounter.innerText = JSON.parse(localStorage.getItem('cartLength')); // Actualizar el texto del contador
    } else {
        cartCounter.style.display = "none"; // Ocultar el contador si está vacío
    }
}

// Llamar a la función para mostrar el contador al cargar la página
displayCartCounter();
