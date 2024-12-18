const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const productPreview = document.getElementById("shopContent"); // Definición de productPreview
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productQuantityInput = document.getElementById("productQuantity");
const productImageInput = document.getElementById("productImage");
const addProductBtn = document.getElementById("add-product");

// Función para actualizar la vista previa
// const updatePreview = () => {

//     productPreview.innerHTML = "";

//     const content = document.createElement("div");
//     content.innerHTML = `
//         <img src="${productImageInput.value}">
//         <h3>${productNameInput.value}</h3> <!-- Asegúrate de que el nombre de la propiedad sea correcto -->
//         <p>${productPriceInput.value} $</p> <!-- Asegúrate de que el nombre de la propiedad sea correcto -->
//     `;
//     shopContent.append(content);

//     const buyButton = document.createElement("button");
//     buyButton.innerText = "Comprar";

//     content.append(buyButton);

// };

// // Escuchar cambios en los campos de entrada para actualizar la vista previa en tiempo real
// productNameInput.addEventListener("input", updatePreview);
// productPriceInput.addEventListener("input", updatePreview);
// productImageInput.addEventListener("input", updatePreview);

// const inputs = document.querySelectorAll('#productForm input');
// inputs.forEach(input => {
//     input.addEventListener('input', updatePreview);
// });

function updatePreview() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const quantity = document.getElementById('productQuantity').value;
    const imageUrl = document.getElementById('productImage').value; 
    const buyButton = document.createElement("button");
    const productPreview = document.createElement('product-preview');

    buyButton.innerText = "Comprar";
    productPreview.append(buyButton);

    

    priceArs = price.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'ARS'
    });

    console.log(priceArs);

    quotas = price / 6;

    quotas = quotas.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'ARS'
    });

    document.getElementById('previewName').textContent = name || 'Nombre del producto';
    document.getElementById('previewPrice').textContent = price ? `$${priceArs}` : 'Precio';
    document.getElementById('previewQuantity').textContent = quantity ? `Stock: ${quantity}` : 'Cantidad';
    document.getElementById('span-quotas').textContent = quotas || 'Cuotas';
    document.getElementById('previewImage').src = imageUrl || '/media/logo.png';


}

// Escuchar cambios en los campos de entrada para actualizar la vista previa en tiempo real
productNameInput.addEventListener("input", updatePreview);
productPriceInput.addEventListener("input", updatePreview);
productQuantityInput.addEventListener("input", updatePreview);
productImageInput.addEventListener("input", updatePreview);
