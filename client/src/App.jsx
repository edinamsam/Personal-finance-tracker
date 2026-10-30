import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      return { ...prev, [name]: value };
    });

    setErrors((prev) => ({
      prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Check whether amount is empty or invalid.
    // 2. Check whether amount is greater than zero.
    const amount = Number(formData.amount);

    if (formData.amount.trim() === "") {
      newErrors.amount = "Amount is required";
    } else if (!Number.isFinite(amount)) {
      newErrors.amount = "Please enter a valid amount";
    } else if (amount <= 0) {
      newErrors.amount = "Amount must be greater than zero";
    }

    // 3. Check whether category is selected.
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      const data = await response.json();

      await fetchSummary();
      await fetchTransactions();

      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
      });

      console.log("Transaction created:", data.transaction);
    } catch (error) {
      console.log("Error creating transaction:", error.message);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
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

      <form onSubmit={handleSubmit}>
        <label>Transaction Type</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <label>Amount (GHC)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
        />
        {errors.amount && <p className="error">{errors.amount}</p>}

        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        {errors.category && <p className="error">{errors.category}</p>}

        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit">Add Transaction</button>
      </form>
    </>
  );
}

export default App;
