import { db } from '../firebase';
import admin from 'firebase-admin';
import { Product } from '../models/product.model';

export class ProductService {
  private collection = db.collection('products');

  async listAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getById(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async create(product: Product) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const data: any = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || '',
      available: product.available ?? true,
      createdAt: now,
      updatedAt: now
    };

    const ref = await this.collection.add(data);
    const created = await ref.get();
    return { id: ref.id, ...created.data() };
  }

  async update(id: string, updates: Partial<Product>) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const data: any = { ...updates, updatedAt: now };
    await this.collection.doc(id).update(data);
    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...doc.data() };
  }

  async delete(id: string) {
    await this.collection.doc(id).delete();
    return { id };
  }
}

export const productService = new ProductService();
