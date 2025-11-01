export interface IUser {
  _id?: string;
  email: string;
  password_hash: string;
  role?: "user" | "admin";
  created_at?: Date;
}
