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
    const data: any = {
      title: payload.title,
      description: payload.description || '',
      discount: typeof payload.discount === 'number' ? payload.discount : null,
      products: Array.isArray(payload.products) ? payload.products : [],
      createdAt: now,
      updatedAt: now
    };

    const ref = await this.collection.add(data);
    const created = await ref.get();
    return { id: ref.id, ...created.data() };
  }

  async getById(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }
}

export const promoService = new PromoService();
