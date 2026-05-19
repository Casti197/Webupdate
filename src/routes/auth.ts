import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/authJwt.js';

const router = Router();

// Registro de usuario
router.post('/register', authController.register);

// Login de usuario
router.post('/login', authController.login);

// Mi perfil (requiere middleware de autenticación)
router.get('/me', verifyToken, authController.me);

export default router;
