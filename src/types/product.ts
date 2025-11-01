export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
