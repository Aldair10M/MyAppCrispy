export interface OrdenItem {
  productId?: string;
  name: string;
  qty: number;
  price: number;
  imageUrl?: string;
  subtotal?: number;
}

export class Orden {
  id?: string;
  items: OrdenItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  userId?: string;
  createdAt?: number;
  updatedAt?: number;

  constructor(
    items: OrdenItem[],
    subtotal: number,
    shipping: number = 0,
    total?: number,
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' = 'pending',
    userId?: string
  ) {
    this.items = items;
    this.subtotal = subtotal;
    this.shipping = shipping;
    this.total = typeof total === 'number' ? total : subtotal + shipping;
    this.status = status;
    this.userId = userId;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}
