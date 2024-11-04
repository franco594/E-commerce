import express from "express";
import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { adminMiddleware, verifyToken } from "../authMiddleware.js";

const router = express.Router();

// Ruta para el registro
router.post("/register", registerUser);

// Ruta para el login
router.post("/login", loginUser);

// Ruta accesible solo para administradores
router.get('/admin', adminMiddleware, (req, res) => {
    // Lógica para la página de administración
    res.json({ message: 'Bienvenido al panel de administración' });
});

router.get('/usuarios', verifyToken, (req, res) => {
  // Lógica para la página de administración
  res.json({ message: 'Bienvenido al panel de usuario' });
});

export default router;
