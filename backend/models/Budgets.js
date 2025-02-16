import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  monthlyLimit: { type: Number, required: true },
  currentSpending: { type: Number, default: 0 },
  month: { type: String, required: true },
});

export default mongoose.model("Budget", budgetSchema);
