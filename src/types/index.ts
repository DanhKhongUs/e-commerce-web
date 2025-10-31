export interface IProduct {
  id: number;
  name: string;
  img: string;
  price: number;
  rating: number;
  discount: number;
  description?: string;
  isFavorite?: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role?: "member" | "admin";
}
