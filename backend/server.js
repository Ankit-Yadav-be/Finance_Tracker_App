import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbconnection from "./config/db.js"
import transactionRoutes from "./routes/TrasactionApi.js"
import categoryRoutes from "./routes/CategoryApi.js"
import budgetRoutes from "./routes/BudgetApi.js"

dotenv.config();
const app = express();
dbconnection();

app.use(express.json());
app.use(cors());

app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
