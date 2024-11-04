import express from "express"; // Importar Express para crear la aplicación
import sequelize from "./db/database.js"; // Importar la instancia de Sequelize para manejar la base de datos
import cors from "cors"; // Importar CORS para permitir solicitudes de diferentes dominios
import path from "path"; // Importar path para manejar rutas de archivos
import dotenv from 'dotenv'; // Importar dotenv para manejar variables de entorno
import { registerUser } from "./controllers/registerController.js"; // Importar controlador para registrar usuarios
import { loginUser } from "./controllers/loginController.js"; // Importar controlador para iniciar sesión
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "./controllers/productController.js"; // Importar controladores para manejar productos
import { verifyToken, adminMiddleware } from "./authMiddleware.js"; // Importar middleware para verificar tokens y roles de administrador
import { fileURLToPath } from 'url'; // Importar fileURLToPath para manejar rutas en módulos ES
import { MercadoPagoConfig, Preference } from "mercadopago"; // Importar configuración y preferencia de MercadoPago

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configurar MercadoPago con el token de acceso de las variables de entorno
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Usar la variable de entorno para el token de acceso
});

// Crear una instancia de la aplicación Express
const app = express();
const port = process.env.PORT; // Obtener el puerto de las variables de entorno

// Obtener el nombre del archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Permitir que la aplicación maneje JSON en el cuerpo de las solicitudes

// Sincronizar la base de datos y crear las tablas si no existen
sequelize.sync()
  .then(() => {
    console.log('Base de datos y tablas creadas/sincronizadas exitosamente.');
    
    // Iniciar el servidor solo si la sincronización es exitosa
    app.listen(port, () => {
      console.log(`El servidor está corriendo en http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });

// Servir archivos estáticos desde la carpeta del cliente
app.use(express.static(path.join(__dirname, '..', 'client')));

// Ruta principal que envía el archivo index.html
app.get("/", (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

// Middleware para evitar caché en las respuestas
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Ruta para crear una preferencia en MercadoPago
app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.description, // Descripción del producto
          unit_price: Number(req.body.price), // Precio del producto
          quantity: Number(req.body.quantity), // Cantidad del producto
          currency_id: "ARS", // Moneda
        },
      ],
      back_urls: {
        success: "http://localhost:3000/", // URL de redirección al éxito
        failure: "http://localhost:3000/", // URL de redirección al fallo
        pending: "http://localhost:3000/", // URL de redirección al estado pendiente
      },
      auto_return: "approved", // Autorreferencia automática si se aprueba
    };

    // Crear una nueva preferencia en MercadoPago
    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({
      id: result.id, // Devolver el ID de la preferencia creada
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia", // Mensaje de error en caso de fallo
    });
  }
});

// Ruta para servir el formulario de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/index.html')); // Enviar el archivo index.html
});

// Ruta para la página de usuarios (requiere autenticación)
app.get('/usuarios.html', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/usuarios.html')); // Enviar el archivo usuarios.html
});

// Ruta para la página de administrador (requiere autenticación y rol de administrador)
app.get('/admin.html', adminMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/admin.html')); // Enviar el archivo admin.html
});

// Ruta para registrar un usuario
app.post('/register', registerUser); // Llamar al controlador de registro de usuario

// Ruta para manejar el inicio de sesión
app.post('/login', loginUser); // Llamar al controlador de inicio de sesión

// Rutas para manejar productos en la API
app.get('/products', getProducts); // Listar productos

app.get('/products/:id', getProductById); // Buscar producto por ID

app.post('/products', verifyToken, createProduct); // Crear un nuevo producto (requiere autenticación)

app.put('/products/:id', verifyToken, updateProduct); // Modificar un producto existente (requiere autenticación)

app.delete('/products/:id', verifyToken, deleteProduct); // Eliminar un producto (requiere autenticación)
