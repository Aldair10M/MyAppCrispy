export interface Promo {
  id?: string;
  title: string;
  description?: string;
  discount?: number | null;
  products?: string[];
  createdAt?: number | any;
  updatedAt?: number | any;
}

export const emptyPromo = (): Promo => ({ title: '', description: '', discount: null, products: [] });
