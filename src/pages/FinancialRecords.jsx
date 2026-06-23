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

  const [expandedRecord, setExpandedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingFinancialRecord, setEditingFinancialRecord] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

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

  const togglePayments = (recordId) => {
    setExpandedRecord((prev) => (prev === recordId ? null : recordId));
  };

  const getStatus = (amountPaid, requiredAmount) => {
    if (amountPaid <= 0) return "unpaid";

    if (amountPaid < requiredAmount) return "partial";

    return "paid";
  };

  const handleSavePayments = async (recordId) => {
    try {
      const updatedPayments = editingRecord.payments.map((payment) => ({
        ...payment,
        status: getStatus(payment.amountPaid, editingRecord.amount),
      }));

      await axios.put(`${API_URL}/${recordId}`, {
        ...editingRecord,
        payments: updatedPayments,
      });

      fetchRecords();

      setEditingRecord(null);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateSummary = (record) => {
    const expectedAmount = record.amount * record.payments.length;

    const collectedAmount = record.payments.reduce(
      (total, payment) => total + (payment.amountPaid || 0),
      0,
    );

    const outstandingAmount = expectedAmount - collectedAmount;

    const paidMembers = record.payments.filter(
      (payment) => payment.status === "paid",
    ).length;

    const partialMembers = record.payments.filter(
      (payment) => payment.status === "partial",
    ).length;

    const unpaidMembers = record.payments.filter(
      (payment) => payment.status === "unpaid",
    ).length;

    return {
      expectedAmount,
      collectedAmount,
      outstandingAmount,
      paidMembers,
      partialMembers,
      unpaidMembers,
    };
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ? true : record.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleRecordUpdate = async () => {
    try {
      setEditLoading(true);

      await axios.put(
        `${API_URL}/${editingFinancialRecord._id}`,
        editingFinancialRecord,
      );

      await fetchRecords();

      setEditingFinancialRecord(null);
    } catch (error) {
      console.error(error);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financial Records</h1>

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
          <option value="monthly">Monthly Contribution</option>

          <option value="special">Special Contribution</option>

          <option value="fine">Fine</option>
        </select>

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Create Record
        </button>
      </form>

      {/* Search Bar */}

      <input
        type="text"
        placeholder="Search financial records..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      {/* Filter Buttons */}

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 rounded ${
            filterType === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilterType("monthly")}
          className={`px-4 py-2 rounded ${
            filterType === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setFilterType("special")}
          className={`px-4 py-2 rounded ${
            filterType === "special" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Special
        </button>

        <button
          onClick={() => setFilterType("fine")}
          className={`px-4 py-2 rounded ${
            filterType === "fine" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Fines
        </button>
      </div>

      {/* Record Counter */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredRecords.length} record(s)
      </p>

      {/* Records List*/}

      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const summary = calculateSummary(record);

          return (
            <div
              key={record._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h2 className="font-semibold text-lg">{record.title}</h2>

              <p>Amount: Ksh {record.amount}</p>

              <p>Type: {record.type}</p>

              <p>
                Deadline:{" "}
                {record.deadline
                  ? new Date(record.deadline).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="mt-4 border-t pt-3 text-sm space-y-1">
                <p>
                  Expected:{" "}
                  <span className="font-semibold">
                    Ksh {summary.expectedAmount}
                  </span>
                </p>

                <p>
                  Collected:{" "}
                  <span className="text-green-600 font-semibold">
                    Ksh {summary.collectedAmount}
                  </span>
                </p>

                <p>
                  Outstanding:{" "}
                  <span className="text-red-600 font-semibold">
                    Ksh {summary.outstandingAmount}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Paid: {summary.paidMembers}
                </span>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  Partial: {summary.partialMembers}
                </span>

                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                  Unpaid: {summary.unpaidMembers}
                </span>
              </div>

              <button
                onClick={() => togglePayments(record._id)}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                {expandedRecord === record._id
                  ? "Hide Payments"
                  : "View Payments"}
              </button>

              <button
                onClick={() => setEditingRecord({ ...record })}
                className="ml-4 text-yellow-600 hover:text-yellow-800"
              >
                Edit Payments
              </button>

              <button
                onClick={() =>
                  setEditingFinancialRecord({
                    ...record,
                  })
                }
                className="ml-4 text-red-600 hover:text-red-800"
              >
                Edit Record
              </button>

              {editingRecord?._id === record._id && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  {editingRecord.payments.map((payment) => {
                    const balance = record.amount - payment.amountPaid;

                    const status = getStatus(payment.amountPaid, record.amount);

                    return (
                      <div key={payment._id} className="border rounded p-3">
                        <p className="font-medium">{payment.member?.name}</p>

                        <div className="mt-2">
                          <label className="block text-sm">Amount Paid</label>

                          <input
                            type="number"
                            max={record.amount}
                            value={payment.amountPaid || ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value);

                              if (value !== "" && value > record.amount) {
                                alert(
                                  `Amount paid cannot exceed Ksh ${record.amount}`,
                                );

                                return;
                              }

                              const updatedPayments =
                                editingRecord.payments.map((p) =>
                                  p._id === payment._id
                                    ? {
                                        ...p,
                                        amountPaid: value,
                                      }
                                    : p,
                                );

                              setEditingRecord({
                                ...editingRecord,
                                payments: updatedPayments,
                              });
                            }}
                            className="border rounded p-2 w-full"
                          />
                        </div>

                        <p className="text-sm mt-2">
                          Required: Ksh {record.amount}
                        </p>

                        <p className="text-sm">Balance: Ksh {balance}</p>

                        <p className="text-sm font-medium">Status: {status}</p>

                        <button
                          onClick={() => handleSavePayments(record._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Save Payments
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {editingFinancialRecord?._id === record._id && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  <input
                    type="text"
                    value={editingFinancialRecord.title}
                    onChange={(e) =>
                      setEditingFinancialRecord({
                        ...editingFinancialRecord,
                        title: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                  />

                  <input
                    type="number"
                    value={editingFinancialRecord.amount || ""}
                    onChange={(e) =>
                      setEditingFinancialRecord({
                        ...editingFinancialRecord,
                        amount: Number(e.target.value),
                      })
                    }
                    className="w-full border p-2 rounded"
                  />

                  <input
                    type="date"
                    value={
                      editingFinancialRecord.deadline
                        ? editingFinancialRecord.deadline.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditingFinancialRecord({
                        ...editingFinancialRecord,
                        deadline: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                  />

                  <button
                    onClick={handleRecordUpdate}
                    disabled={editLoading}
                    className={`px-4 py-2 rounded text-white ${
                      editLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {expandedRecord === record._id && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  {record.payments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex justify-between items-center border rounded p-3"
                    >
                      <div>
                        <p className="font-medium">{payment.member?.name}</p>

                        <p className="text-sm text-gray-500">
                          {payment.member?.phone}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialRecords;
