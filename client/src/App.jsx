import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

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

        console.log("API response", data);

        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary:", error.message);
      }
    };

    fetchSummary();
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
    </>
  );
}

export default App;
