import { Router } from 'express';
import { registerUser, verifyUserCode, debugGetUser, loginUser, updateUser } from '../controllers/user.controller';

const router = Router();

// Endpoint para registrar usuario
router.post('/register', registerUser);
router.post('/verify', verifyUserCode);
router.post('/login', loginUser);
router.get('/debug', debugGetUser);
router.put('/update', updateUser);

export default router;
