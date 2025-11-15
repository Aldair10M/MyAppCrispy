import { Router } from 'express';
import { listPromos, createPromo, getPromo } from '../controllers/promo.controller';

const router = Router();

router.get('/', listPromos);
router.get('/:id', getPromo);
router.post('/', createPromo);
import { updatePromo, deletePromo } from '../controllers/promo.controller';

router.put('/:id', updatePromo);
router.delete('/:id', deletePromo);

export default router;
