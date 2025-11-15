export interface PromoProduct {
  id: string;
  name: string;
  price: number;
}

export interface Promo {
  id?: string;
  title: string;
  description?: string;
  discount?: number | null;
  products?: PromoProduct[];
  priceTotalDescuento?: number | null;
  precioTotal?: number | null;
  createdAt?: number | any;
  updatedAt?: number | any;
}

export const emptyPromo = (): Promo => ({ title: '', description: '', discount: null, products: [], priceTotalDescuento: null, precioTotal: null });
