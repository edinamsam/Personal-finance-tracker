import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/transactions/summary",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transaction summary");
        }

        const data = await response.json();

        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary:", error.message);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions");

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <>
      <h1>Personal Finance Tracker</h1>

      <h2>Available Balance</h2>
      <p>GHC{summary.balance.toFixed(2)}</p>

      <h2>Total Income</h2>
      <p>GHC{summary.totalIncome.toFixed(2)}</p>

      <h2>Total Expenses</h2>
      <p>GHC{summary.totalExpenses.toFixed(2)}</p>

      <h2>Recent Transactions</h2>
      {transactions.map((transaction) => {
        return (
          <div key={transaction._id} className="transaction-container">
            <div>
              <h3>{transaction.category}</h3>
              <div>
                <p>{transaction.description}</p>
                <span>{transaction.type}</span>
              </div>
              <p>{new Date(transaction.date).toLocaleDateString()}</p>
            </div>

            <p
              style={{ color: transaction.type === "income" ? "green" : "red" }}
            >
              GHC{transaction.amount.toFixed(2)}
            </p>
          </div>
        );
      })}
    </>
  );
}

export default App;
