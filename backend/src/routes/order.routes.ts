import { Router } from 'express';
import { createOrder, listOrders, updateOrder } from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.get('/', listOrders);
router.put('/:id', updateOrder);

export default router;
