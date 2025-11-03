import { Request, Response } from 'express';
import { db } from '../firebase';
import { Orden } from '../models/orden.model';

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

    // attach optional metadata
    if ((payload as any).email) (order as any).email = (payload as any).email;

    const ordersRef = db.collection('orders');
    const docRef = ordersRef.doc();
    order.id = docRef.id;
    order.createdAt = Date.now();
    order.updatedAt = Date.now();

    await docRef.set(JSON.parse(JSON.stringify(order)));

    const saved = (await docRef.get()).data();
    return res.status(201).json({ message: 'order created', order: saved });
  } catch (err: any) {
    console.error('createOrder error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
