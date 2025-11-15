import { Request, Response } from 'express';
import { Orden } from '../models/orden.model';
import { orderService } from '../services/order.service';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
      return res.status(400).json({ error: 'items are required' });
    }

    const order = new Orden(
      payload.items,
      Number(payload.subtotal) || 0,
      Number(payload.shipping) || 0,
      Number(payload.total) || undefined,
      payload.status || 'pending',
      payload.userId || undefined
    );

    if ((payload as any).email) (order as any).email = (payload as any).email;

    const saved = await orderService.create(order);
    return res.status(201).json({ message: 'order created', order: saved });
  } catch (err: any) {
    console.error('createOrder error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  try {
    const email = (req.query as any)['email'] as string | undefined;
    const userId = (req.query as any)['userId'] as string | undefined;

    const status = (req.query as any)['status'] as string | undefined;

    const items = await orderService.list({ email, userId, status });
    return res.status(200).json(items);
  } catch (err: any) {
    console.error('listOrders error', err);
    // Si es un error por índice requerido de Firestore, informamos claramente al cliente
    if (err?.code === 9 /* failed-precondition */ || /index|indexes/i.test(String(err?.message))) {
      return res.status(400).json({ error: 'index-required', message: 'Firestore needs a composite index. Removed server-side order; please retry.' });
    }
    return res.status(500).json({ error: 'internal' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const updated = await orderService.update(id, updates);
    res.json({ ok: true, order: updated });
  } catch (err: any) {
    console.error('updateOrder error', err);
    res.status(500).json({ ok: false, error: 'internal' });
  }
};
