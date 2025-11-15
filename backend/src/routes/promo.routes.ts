import { Router } from 'express';
import { listPromos, createPromo, getPromo } from '../controllers/promo.controller';

const router = Router();

router.get('/', listPromos);
router.get('/:id', getPromo);
router.post('/', createPromo);

export default router;
