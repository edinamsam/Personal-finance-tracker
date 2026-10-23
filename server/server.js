import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Transaction from "./models/Transaction.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Personal Finance Tracker API is running",
  });
});

app.post("/api/transactions", async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);

    res.status(200).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create transaction",
      error: error.message,
    });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      date: -1,
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({
      message: "Failed to retrieve transactions",
      error: error.message,
    });
  }
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
