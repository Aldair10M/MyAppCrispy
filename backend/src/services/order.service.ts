import { db } from '../firebase';
import admin from 'firebase-admin';

export class OrderService {
  private collection = db.collection('orders');

  async create(order: any) {
    const now = Date.now();
    const docRef = this.collection.doc();
    order.id = docRef.id;
    order.createdAt = now;
    order.updatedAt = now;
    await docRef.set(JSON.parse(JSON.stringify(order)));
    const saved = (await docRef.get()).data();
    return saved;
  }

  async list(filter: { email?: string; userId?: string; status?: string } = {}) {
    let ref: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = this.collection as any;
    if (filter.email) ref = ref.where('email', '==', filter.email);
    if (filter.userId) ref = ref.where('userId', '==', filter.userId);
    if ((filter as any).status) ref = ref.where('status', '==', (filter as any).status);
    const snap = await ref.get();
    const items = snap.docs.map(d => d.data()).sort((a: any, b: any) => (b?.createdAt || 0) - (a?.createdAt || 0));
    return items;
  }

  async update(id: string, updates: Partial<any>) {
    const now = Date.now();
    const data: any = { ...updates, updatedAt: now };
    await this.collection.doc(id).update(data);
    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...doc.data() };
  }
}

export const orderService = new OrderService();
