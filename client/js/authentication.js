// Función para iniciar sesión
async function login() {
    // Obtener los valores de los campos de entrada para el nombre de usuario y la contraseña
    const user_name = document.querySelector('input[name="user_name"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Hacer una solicitud POST al servidor para iniciar sesión
    const response = await fetch('https://concatenados-e-commerce.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: user_name, password: password }),
    });

    // Convertir la respuesta a JSON
    const data = await response.json();
    
    // Verificar si la respuesta fue exitosa
    if (response.ok) {
        // Almacenar el token en sessionStorage para sesiones persistentes
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('username', data.user.user_name); // Guarda el nombre de usuario
        sessionStorage.setItem('role', data.user.role); // Guarda el rol del usuario
        
        console.log("Rol de usuario: ", data.user.role); // Imprimir el rol del usuario en la consola

        // Redirigir al usuario a la página correspondiente según su rol
        if (data.user.role === 'admin') {
            window.location.replace('./admin.html'); // Redirigir a la página del administrador
        } else {
            window.location.replace('./usuarios.html'); // Redirigir a la página de usuarios
        }
        
    } else {
        // Si la respuesta no es exitosa, mostrar un mensaje de error
        alert(data.message);
    }
}

// Función para verificar el token al cargar las páginas protegidas
function verifyToken() {
    // Obtener el token almacenado en sessionStorage
    const token = sessionStorage.getItem('token');
    // Si no hay un token, redirigir al usuario a la página de inicio de sesión
    if (!token) {
        window.location.replace('./index.html'); // Cambia a la ruta correcta
    }
}

// Llamar a verifyToken cuando el DOM esté completamente cargado en las páginas protegidas
document.addEventListener('DOMContentLoaded', verifyToken);
