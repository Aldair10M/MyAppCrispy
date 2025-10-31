import { Router } from 'express';
import { registerUser, verifyUserCode, debugGetUser } from '../controllers/user.controller';

const router = Router();

// Endpoint para registrar usuario
router.post('/register', registerUser);
router.post('/verify', verifyUserCode);
router.get('/debug', debugGetUser);

export default router;
