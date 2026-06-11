import { useEffect, useState } from "react";
import axios from "axios";

const FinancialRecords = () => {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "monthly",
    deadline: "",
  });

  const API_URL = "http://localhost:5000/api/financial-records";

  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, {
        ...form,
        amount: Number(form.amount),
        appliesToAll: form.type !== "fine",
      });

      setForm({
        title: "",
        amount: "",
        type: "monthly",
        deadline: "",
      });

      fetchRecords();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Financial Records
      </h1>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-4 mb-6 space-y-3"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="monthly">
            Monthly Contribution
          </option>

          <option value="special">
            Special Contribution
          </option>

          <option value="fine">
            Fine
          </option>
        </select>

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Record
        </button>
      </form>

      {/* Records */}

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record._id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <h2 className="font-semibold text-lg">
              {record.title}
            </h2>

            <p>
              Amount: Ksh {record.amount}
            </p>

            <p>
              Type: {record.type}
            </p>

            <p>
              Deadline:
              {" "}
              {record.deadline
                ? new Date(
                    record.deadline
                  ).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FinancialRecords;