export interface IProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  discount: number;
  product_date: Date;
  description: string;
}

export interface ICategory {
  category_id: string;
  category_name: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role?: "member" | "admin";
}
