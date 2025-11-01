import { Router } from 'express';
import { registerUser, verifyUserCode, debugGetUser, loginUser } from '../controllers/user.controller';

const router = Router();

// Endpoint para registrar usuario
router.post('/register', registerUser);
router.post('/verify', verifyUserCode);
router.post('/login', loginUser);
router.get('/debug', debugGetUser);

export default router;
