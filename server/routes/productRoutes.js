import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { adminMiddleware, verifyToken } from "../authMiddleware.js"; 
const router = express.Router();

router.get('/products', getProducts); // Obtener todos los productos
router.get('/products/:id', getProductById); // Obtener producto por ID
router.post('/products', adminMiddleware, createProduct); // Crear producto (solo para usuarios autenticados)
router.put('/products/:id', adminMiddleware, updateProduct); // Actualizar producto
router.delete('/products/:id', adminMiddleware, deleteProduct); // Eliminar producto

export default router;
 