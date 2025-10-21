import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, require: true },
    description: { type: String },
    mrp: { type: Number },
    price: { type: Number },
    category: { type: String },
    images: { type: String },
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    inStock: { type: Boolean },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
