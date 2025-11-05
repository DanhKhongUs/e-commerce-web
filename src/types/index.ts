export interface IProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  discount: number;
  product_date?: Date;
  description?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role?: "member" | "admin";
}
