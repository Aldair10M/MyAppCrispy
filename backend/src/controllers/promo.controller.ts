import { Request, Response } from 'express';
import { promoService } from '../services/promo.service';

export const listPromos = async (req: Request, res: Response) => {
  try {
    const items = await promoService.listAll();
    return res.status(200).json(items);
  } catch (err: any) {
    console.error('listPromos error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

export const updatePromo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await promoService.update(id, updates);
    res.json({ ok: true, promo: updated });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const deletePromo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await promoService.delete(id);
    res.json({ ok: true, id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const createPromo = async (req: Request, res: Response) => {
  try {
    const { title, description, discount, products } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const created = await promoService.create({ title, description, discount, products });
    return res.status(201).json({ message: 'Promo created', promo: created });
  } catch (err: any) {
    console.error('createPromo error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

export const getPromo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const item = await promoService.getById(id);
    if (!item) return res.status(404).json({ error: 'not found' });
    return res.status(200).json(item);
  } catch (err: any) {
    console.error('getPromo error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
