import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbconnection from "./config/db.js"
import transactionRoutes from "./routes/TrasactionApi.js"
import categoryRoutes from "./routes/CategoryApi.js"
import budgetRoutes from "./routes/BudgetApi.js"
import path from "path";
dotenv.config();
const app = express();
dbconnection();

const _dirname = path.resolve();


app.use(express.json());
const corsOptions = {
  origin:"https://finance-tracker-app-vgak.onrender.com",
  credentials:true
}
app.use(cors(corsOptions));

app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);

app.use(express.static(path.join(_dirname, "/frontends/dist")))
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname, "frontends", "dist", "index.html"));
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
