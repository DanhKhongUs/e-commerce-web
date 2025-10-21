import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({
  stars: Number,
  comment: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Rating = mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
export default Rating;
