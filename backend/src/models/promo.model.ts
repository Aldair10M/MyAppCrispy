export class Promo {
  id?: string;
  title: string;
  description?: string;
  discount?: number | null;
  products: Array<string> = [];
  createdAt?: any;
  updatedAt?: any;

  constructor(title: string, description?: string, discount?: number | null, products?: string[]) {
    this.title = title;
    this.description = description || '';
    this.discount = typeof discount === 'number' ? discount : null;
    this.products = products || [];
    this.createdAt = undefined;
    this.updatedAt = undefined;
  }
}
