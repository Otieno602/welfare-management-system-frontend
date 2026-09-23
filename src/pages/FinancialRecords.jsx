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
  const [editingFinancialRecord, setEditingFinancialRecord] =
    useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

      setShowCreateForm(false);

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
    setExpandedRecord((prev) =>
      prev === recordId ? null : recordId
    );
  };

  const getStatus = (amountPaid, requiredAmount) => {
    if (amountPaid <= 0) return "unpaid";

    if (amountPaid < requiredAmount) return "partial";

    return "paid";
  };

  const handleSavePayments = async (recordId) => {
    try {
      const updatedPayments = editingRecord.payments.map(
        (payment) => ({
          ...payment,
          status: getStatus(
            payment.amountPaid,
            editingRecord.amount
          ),
        })
      );

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
    const expectedAmount =
      record.amount * record.payments.length;

    const collectedAmount = record.payments.reduce(
      (total, payment) =>
        total + (payment.amountPaid || 0),
      0
    );

    const outstandingAmount =
      expectedAmount - collectedAmount;

    const paidMembers = record.payments.filter(
      (payment) => payment.status === "paid"
    ).length;

    const partialMembers = record.payments.filter(
      (payment) => payment.status === "partial"
    ).length;

    const unpaidMembers = record.payments.filter(
      (payment) => payment.status === "unpaid"
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
      record.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.type
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all"
        ? true
        : record.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleRecordUpdate = async () => {
    try {
      setEditLoading(true);

      await axios.put(
        `${API_URL}/${editingFinancialRecord._id}`,
        editingFinancialRecord
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
    <div className="min-h-screen bg-welfare-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-welfare-text-primary">
            Financial Records
          </h1>

          <p className="text-welfare-text-secondary mt-2">
            Manage welfare contributions, payments and
            outstanding balances.
          </p>
        </div>

        {/* =====================================================
            CREATE CONTRIBUTION
        ====================================================== */}
        <div className="mb-6">
          <button
            onClick={() =>
              setShowCreateForm(!showCreateForm)
            }
            className="bg-welfare-primary hover:bg-welfare-primaryDark text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200"
          >
            {showCreateForm
              ? "Cancel"
              : "+ New Contribution"}
          </button>
        </div>

        {/* Create Form */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showCreateForm
              ? "max-h-[700px] opacity-100 mb-6"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-5 md:p-6">

            <div className="mb-5">
              <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
                New Contribution
              </h2>

              <p className="text-sm text-welfare-text-secondary mt-1">
                Create a contribution or fine for the
                welfare group.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. September Contribution"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                  Contribution Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
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
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                  Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-welfare-primary hover:bg-welfare-primaryDark text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200"
                >
                  Create Contribution
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* =====================================================
            SEARCH & FILTERS
        ====================================================== */}
        <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-5 md:p-6 mb-6">

          <div className="mb-5">
            <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
              Find Contributions
            </h2>

            <p className="text-sm text-welfare-text-secondary mt-1">
              Search or filter your financial records.
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by title or contribution type..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full border border-welfare-border bg-welfare-surface px-4 py-3 rounded-xl text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition shadow-sm"
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">

            {[
              { value: "all", label: "All" },
              { value: "monthly", label: "Monthly" },
              { value: "special", label: "Special" },
              { value: "fine", label: "Fines" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() =>
                  setFilterType(filter.value)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === filter.value
                    ? "bg-welfare-primary text-white"
                    : "bg-welfare-primaryLight text-welfare-primary hover:bg-welfare-primaryLight"
                }`}
              >
                {filter.label}
              </button>
            ))}

          </div>

          <p className="text-sm text-welfare-text-secondary mt-4">
            Showing {filteredRecords.length}{" "}
            {filteredRecords.length === 1
              ? "record"
              : "records"}
          </p>
        </div>

        {/* =====================================================
            RECORDS
        ====================================================== */}
        <div className="space-y-5">

          {filteredRecords.length === 0 ? (
            <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-8 md:p-12 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-welfare-primaryLight flex items-center justify-center text-2xl mb-4">
                {records.length === 0 ? "💰" : "🔎"}
              </div>

              <h3 className="text-lg font-semibold text-welfare-text-primary">
                {records.length === 0
                  ? "No financial records yet"
                  : "No records found"}
              </h3>

              <p className="text-sm text-welfare-text-secondary mt-1">
                {records.length === 0
                  ? "Create your first contribution to start tracking welfare finances."
                  : "Try changing your search or filter."}
              </p>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const summary = calculateSummary(record);

              return (
                <div
                  key={record._id}
                  className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6"
                >

                  {/* =================================================
                      RECORD HEADER
                  ================================================== */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
                        {record.title}
                      </h2>

                      <p className="text-sm text-welfare-text-secondary mt-1">
                        Deadline:{" "}
                        {record.deadline
                          ? new Date(
                              record.deadline
                            ).toLocaleDateString()
                          : "No deadline"}
                      </p>
                    </div>

                    <span
                      className={`self-start inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        record.type === "fine"
                          ? "bg-red-50 text-welfare-danger"
                          : "bg-welfare-primaryLight text-welfare-primary"
                      }`}
                    >
                      {record.type}
                    </span>
                  </div>

                  {/* =================================================
                      AMOUNT
                  ================================================== */}
                  <p className="text-2xl md:text-3xl font-bold text-welfare-text-primary mt-4">
                    Ksh {record.amount.toLocaleString()}
                  </p>

                  {/* =================================================
                      FINANCIAL SUMMARY
                  ================================================== */}
                  <div className="mt-5 pt-4 border-t border-welfare-border grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-welfare-text-muted">
                        Expected
                      </p>

                      <p className="text-sm font-semibold text-welfare-text-primary mt-1">
                        Ksh{" "}
                        {summary.expectedAmount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-welfare-text-muted">
                        Collected
                      </p>

                      <p className="text-sm font-semibold text-welfare-success mt-1">
                        Ksh{" "}
                        {summary.collectedAmount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-welfare-text-muted">
                        Outstanding
                      </p>

                      <p className="text-sm font-semibold text-welfare-danger mt-1">
                        Ksh{" "}
                        {summary.outstandingAmount.toLocaleString()}
                      </p>
                    </div>

                  </div>

                  {/* =================================================
                      PAYMENT STATUS
                  ================================================== */}
                  <div className="flex flex-wrap gap-2 mt-5">

                    <span className="bg-green-50 text-welfare-success px-3 py-1.5 rounded-full text-xs font-semibold">
                      Paid: {summary.paidMembers}
                    </span>

                    <span className="bg-orange-50 text-welfare-warning px-3 py-1.5 rounded-full text-xs font-semibold">
                      Partial: {summary.partialMembers}
                    </span>

                    <span className="bg-red-50 text-welfare-danger px-3 py-1.5 rounded-full text-xs font-semibold">
                      Unpaid: {summary.unpaidMembers}
                    </span>

                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================== */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 pt-4 border-t border-welfare-border">

                    <button
                      onClick={() =>
                        togglePayments(record._id)
                      }
                      className="text-sm font-medium text-welfare-primary hover:text-welfare-primaryDark transition-colors"
                    >
                      {expandedRecord === record._id
                        ? "Hide Payments"
                        : "View Payments"}
                    </button>

                    <button
                      onClick={() =>
                        setEditingRecord({ ...record })
                      }
                      className="text-sm font-medium text-welfare-primary hover:text-welfare-primaryDark transition-colors"
                    >
                      Edit Payments
                    </button>

                    <button
                      onClick={() =>
                        setEditingFinancialRecord({
                          ...record,
                        })
                      }
                      className="text-sm font-medium text-welfare-text-secondary hover:text-welfare-text-primary transition-colors"
                    >
                      Edit Record
                    </button>

                  </div>

                  {/* =================================================
                      EDIT PAYMENTS
                  ================================================== */}
                  {editingRecord?._id === record._id && (
                    <div className="mt-5 pt-5 border-t border-welfare-border">

                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-welfare-text-primary">
                          Edit Payments
                        </h3>

                        <p className="text-sm text-welfare-text-secondary mt-1">
                          Update the amount paid for each member.
                        </p>
                      </div>

                      <div className="space-y-3">

                        {editingRecord.payments.map(
                          (payment) => {
                            const balance =
                              record.amount -
                              payment.amountPaid;

                            const status = getStatus(
                              payment.amountPaid,
                              record.amount
                            );

                            return (
                              <div
                                key={payment._id}
                                className="border border-welfare-border rounded-xl p-4 bg-welfare-background"
                              >

                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                  <div>
                                    <p className="font-semibold text-welfare-text-primary">
                                      {payment.member?.name}
                                    </p>

                                    <p className="text-sm text-welfare-text-secondary mt-1">
                                      {payment.member?.phone ||
                                        "No phone number"}
                                    </p>
                                  </div>

                                  <span
                                    className={`self-start px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                      status === "paid"
                                        ? "bg-green-50 text-welfare-success"
                                        : status === "partial"
                                        ? "bg-orange-50 text-welfare-warning"
                                        : "bg-red-50 text-welfare-danger"
                                    }`}
                                  >
                                    {status}
                                  </span>

                                </div>

                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                                    Amount Paid
                                  </label>

                                  <input
                                    type="number"
                                    max={record.amount}
                                    value={
                                      payment.amountPaid || ""
                                    }
                                    onChange={(e) => {
                                      const value =
                                        e.target.value === ""
                                          ? ""
                                          : Number(
                                              e.target.value
                                            );

                                      if (
                                        value !== "" &&
                                        value > record.amount
                                      ) {
                                        alert(
                                          `Amount paid cannot exceed Ksh ${record.amount}`
                                        );

                                        return;
                                      }

                                      const updatedPayments =
                                        editingRecord.payments.map(
                                          (p) =>
                                            p._id ===
                                            payment._id
                                              ? {
                                                  ...p,
                                                  amountPaid:
                                                    value,
                                                }
                                              : p
                                        );

                                      setEditingRecord({
                                        ...editingRecord,
                                        payments:
                                          updatedPayments,
                                      });
                                    }}
                                    className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                                  <div className="bg-welfare-surface border border-welfare-border rounded-lg p-3">
                                    <p className="text-xs text-welfare-text-muted">
                                      Required
                                    </p>

                                    <p className="text-sm font-semibold text-welfare-text-primary mt-1">
                                      Ksh{" "}
                                      {record.amount.toLocaleString()}
                                    </p>
                                  </div>

                                  <div className="bg-welfare-surface border border-welfare-border rounded-lg p-3">
                                    <p className="text-xs text-welfare-text-muted">
                                      Balance
                                    </p>

                                    <p
                                      className={`text-sm font-semibold mt-1 ${
                                        balance > 0
                                          ? "text-welfare-danger"
                                          : "text-welfare-success"
                                      }`}
                                    >
                                      Ksh{" "}
                                      {Number(
                                        balance
                                      ).toLocaleString()}
                                    </p>
                                  </div>

                                </div>

                                <button
                                  onClick={() =>
                                    handleSavePayments(
                                      record._id
                                    )
                                  }
                                  className="mt-4 bg-welfare-primary hover:bg-welfare-primaryDark text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition"
                                >
                                  Save Payments
                                </button>
                              </div>
                            );
                          }
                        )}

                      </div>
                    </div>
                  )}

                  {/* =================================================
                      EDIT FINANCIAL RECORD
                  ================================================== */}
                  {editingFinancialRecord?._id ===
                    record._id && (
                    <div className="mt-5 pt-5 border-t border-welfare-border">

                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-welfare-text-primary">
                          Edit Record
                        </h3>

                        <p className="text-sm text-welfare-text-secondary mt-1">
                          Update the contribution details.
                        </p>
                      </div>

                      <div className="space-y-4">

                        <div>
                          <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                            Title
                          </label>

                          <input
                            type="text"
                            value={
                              editingFinancialRecord.title
                            }
                            onChange={(e) =>
                              setEditingFinancialRecord({
                                ...editingFinancialRecord,
                                title: e.target.value,
                              })
                            }
                            className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                            Amount
                          </label>

                          <input
                            type="number"
                            value={
                              editingFinancialRecord.amount ||
                              ""
                            }
                            onChange={(e) =>
                              setEditingFinancialRecord({
                                ...editingFinancialRecord,
                                amount: Number(
                                  e.target.value
                                ),
                              })
                            }
                            className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                            Deadline
                          </label>

                          <input
                            type="date"
                            value={
                              editingFinancialRecord.deadline
                                ? editingFinancialRecord.deadline.split(
                                    "T"
                                  )[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditingFinancialRecord({
                                ...editingFinancialRecord,
                                deadline: e.target.value,
                              })
                            }
                            className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                          />
                        </div>

                        <button
                          onClick={handleRecordUpdate}
                          disabled={editLoading}
                          className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition ${
                            editLoading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-welfare-primary hover:bg-welfare-primaryDark"
                          }`}
                        >
                          {editLoading
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                      </div>
                    </div>
                  )}

                  {/* =================================================
                      VIEW PAYMENTS
                  ================================================== */}
                  {expandedRecord === record._id && (
                    <div className="mt-5 pt-5 border-t border-welfare-border">

                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-welfare-text-primary">
                          Payment Details
                        </h3>

                        <p className="text-sm text-welfare-text-secondary mt-1">
                          Payment status for each member.
                        </p>
                      </div>

                      <div className="space-y-2">

                        {record.payments.map(
                          (payment) => (
                            <div
                              key={payment._id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-welfare-border rounded-xl p-4 bg-welfare-background"
                            >

                              <div>
                                <p className="font-semibold text-welfare-text-primary">
                                  {payment.member?.name}
                                </p>

                                <p className="text-sm text-welfare-text-secondary mt-1">
                                  {payment.member?.phone ||
                                    "No phone number"}
                                </p>

                                <p className="text-xs text-welfare-text-muted mt-1">
                                  Paid: Ksh{" "}
                                  {Number(
                                    payment.amountPaid || 0
                                  ).toLocaleString()}
                                </p>
                              </div>

                              <span
                                className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                  payment.status ===
                                  "paid"
                                    ? "bg-green-50 text-welfare-success"
                                    : payment.status ===
                                      "partial"
                                    ? "bg-orange-50 text-welfare-warning"
                                    : "bg-red-50 text-welfare-danger"
                                }`}
                              >
                                {payment.status}
                              </span>

                            </div>
                          )
                        )}

                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}

        </div>

      </div>
    </div>
  );
};

export default FinancialRecords;