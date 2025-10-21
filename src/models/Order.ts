import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  total: Number,
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
});
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
