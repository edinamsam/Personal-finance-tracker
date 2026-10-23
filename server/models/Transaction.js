import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than zero"],
    },

    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
