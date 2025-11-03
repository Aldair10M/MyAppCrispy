import { Request, Response } from 'express';
import { productService } from '../services/product.service';

export const listProducts = async (req: Request, res: Response) => {
  try {
    const items = await productService.listAll();
    return res.status(200).json(items);
  } catch (err: any) {
    console.error('listProducts error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const item = await productService.getById(id);
    if (!item) return res.status(404).json({ error: 'not found' });
    return res.status(200).json(item);
  } catch (err: any) {
    console.error('getProduct error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    if (!payload.name || typeof payload.price !== 'number' || !payload.category) {
      return res.status(400).json({ error: 'name, price (number) and category are required' });
    }

    const created = await productService.create(payload);
    return res.status(201).json(created);
  } catch (err: any) {
    console.error('createProduct error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updates = req.body;
    const updated = await productService.update(id, updates);
    return res.status(200).json(updated);
  } catch (err: any) {
    console.error('updateProduct error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await productService.delete(id);
    return res.status(200).json({ message: 'deleted' });
  } catch (err: any) {
    console.error('deleteProduct error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
