import { db } from '../firebase';
import admin from 'firebase-admin';

export class PromoService {
  private collection = db.collection('promotions');

  async listAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async create(payload: any) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const productIds: string[] = Array.isArray(payload.products) ? payload.products : [];

    // Resolve product details (id, name, price) for each product id
    const productsDetailed = await Promise.all(
      productIds.map(async (pid) => {
        try {
          const doc = await db.collection('products').doc(pid).get();
          if (!doc.exists) return { id: pid, name: '', price: 0 };
          const d: any = doc.data();
          return { id: doc.id, name: d?.name || '', price: typeof d?.price === 'number' ? d.price : Number(d?.price) || 0 };
        } catch (err) {
          return { id: pid, name: '', price: 0 };
        }
      })
    );

    const subtotal = productsDetailed.reduce((s, p) => s + (p.price || 0), 0);
    const discount = typeof payload.discount === 'number' ? payload.discount : null;
    const priceTotalDescuento = discount !== null ? Number((subtotal - (subtotal * discount) / 100).toFixed(2)) : null;

    const data: any = {
      title: payload.title,
      description: payload.description || '',
      discount: discount,
      products: productsDetailed,
      // precioTotal stores the normal subtotal (sin descuento)
      precioTotal: Number(subtotal.toFixed(2)),
      // priceTotalDescuento stores the final price after applying the discount
      priceTotalDescuento,
      createdAt: now,
      updatedAt: now
    };

    const ref = await this.collection.add(data);
    const created = await ref.get();
    return { id: ref.id, ...created.data() };
  }

  async update(id: string, updates: Partial<any>) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    // Fetch existing promo to merge data if needed
    const existingDoc = await this.collection.doc(id).get();
    const existing: any = existingDoc.exists ? existingDoc.data() : {};

    // Determine product ids: updates may pass array of ids or array of objects
    let productIds: string[] = [];
    if ((updates as any).products) {
      productIds = Array.isArray((updates as any).products)
        ? (updates as any).products.map((p: any) => (typeof p === 'string' ? p : p.id)).filter(Boolean)
        : [];
    } else if (Array.isArray(existing.products)) {
      // existing.products may be array of objects with id
      productIds = existing.products.map((p: any) => (typeof p === 'string' ? p : p?.id)).filter(Boolean);
    }

    let productsDetailed = existing.products || [];
    if (productIds.length > 0) {
      productsDetailed = await Promise.all(
        productIds.map(async (pid) => {
          try {
            const doc = await db.collection('products').doc(pid).get();
            if (!doc.exists) return { id: pid, name: '', price: 0 };
            const d: any = doc.data();
            return { id: doc.id, name: d?.name || '', price: typeof d?.price === 'number' ? d.price : Number(d?.price) || 0 };
          } catch (err) {
            return { id: pid, name: '', price: 0 };
          }
        })
      );
    }

    const subtotal = productsDetailed.reduce((s: number, p: any) => s + (p.price || 0), 0);
    const discountValue = typeof (updates as any).discount === 'number' ? (updates as any).discount : (existing.discount ?? null);
    const priceTotalDescuento = discountValue !== null ? Number((subtotal - (subtotal * discountValue) / 100).toFixed(2)) : null;

    const data: any = { ...updates, products: productsDetailed, // precioTotal: subtotal (normal price), priceTotalDescuento: discounted final price
      precioTotal: Number(subtotal.toFixed(2)), priceTotalDescuento, updatedAt: now };

    await this.collection.doc(id).update(data);
    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...doc.data() };
  }

  async delete(id: string) {
    await this.collection.doc(id).delete();
    return { id };
  }

  async getById(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }
}

export const promoService = new PromoService();
