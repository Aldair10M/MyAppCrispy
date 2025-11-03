export class Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  createdAt?: number | any;
  updatedAt?: number | any;

  constructor(
    name: string,
    price: number,
    category: string,
    description?: string,
    imageUrl?: string,
    available: boolean = true
  ) 
  
  {
    this.name = name;
    this.price = price;
    this.category = category;
    this.description = description;
    this.imageUrl = imageUrl;
    this.available = available;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}
