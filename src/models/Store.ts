import mongoose, { Schema } from "mongoose";

const StoreSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    description: { type: String },
    email: { type: String, required: true },
    contact: { type: String },
    address: { type: String },
    image: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Store = mongoose.models.Store || mongoose.model("Store", StoreSchema);
export default Store;
