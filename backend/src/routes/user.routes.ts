import { Router } from 'express';
import { registerUser } from '../controllers/user.controller';

const router = Router();

// Endpoint para registrar usuario
router.post('/register', registerUser);

export default router;
