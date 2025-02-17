import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard";
import Main from "./component/Main";
import MonthlyExpensesChart from "./component/MonthlyExpensesChart";
import TransactionForm from "./component/TransactionForm";
import TransactionList from "./component/TransactionList";
import BudgetForm from "./component/BudgetForm";
import SpendingInsights from "./component/Insights";
import BudgetComparisonChart from "./component/BudgetComparisonChart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monthly-expenses" element={<MonthlyExpensesChart />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/add-transaction" element={<TransactionForm />} />
        <Route path="/budget-form" element={<BudgetForm />} />
        <Route path="/insights" element={<SpendingInsights />} />
        <Route path="/budget-comparison" element={<BudgetComparisonChart />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
