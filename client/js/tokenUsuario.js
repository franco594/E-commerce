document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('token'); // Elimina el token
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('username');
    window.location.replace('./index.html'); // Redirige a la página de inicio de sesión
});

