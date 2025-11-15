import { Router } from 'express';
import { createOrder, listOrders } from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.get('/', listOrders);

export default router;
