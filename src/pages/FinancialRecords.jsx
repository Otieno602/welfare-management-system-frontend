import { useEffect, useMemo, useState } from "react";
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

  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("unpaid");
  const [paymentSaveLoading, setPaymentSaveLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/financial-records";

  /* ============================================================
     FETCH RECORDS
  ============================================================ */

  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL);

      setRecords(res.data);

      return res.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  /* ============================================================
     FORM HANDLING
  ============================================================ */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ============================================================
     CREATE CONTRIBUTION
  ============================================================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_URL, {
        ...form,
        amount: Number(form.amount),
        appliesToAll: form.type !== "fine",
      });

      const createdRecordId = response.data?._id;

      setShowCreateForm(false);

      setForm({
        title: "",
        amount: "",
        type: "monthly",
        deadline: "",
      });

      const freshRecords = await fetchRecords();

      /*
       * If the backend returns the newly created record ID,
       * immediately open that contribution for payment recording.
       */
      if (createdRecordId) {
        const createdRecord = freshRecords.find(
          (record) => record._id === createdRecordId
        );

        if (
          createdRecord &&
          Array.isArray(createdRecord.payments) &&
          createdRecord.payments.length > 0
        ) {
          setEditingRecord({
            ...createdRecord,
            payments: createdRecord.payments.map((payment) => ({
              ...payment,
              amountPaid: Number(payment.amountPaid || 0),
            })),
          });

          setExpandedRecord(null);
          setEditingFinancialRecord(null);
          setPaymentSearch("");
          setPaymentFilter("unpaid");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ============================================================
     PAYMENT VIEW
  ============================================================ */

  const togglePayments = (recordId) => {
    setExpandedRecord((prev) =>
      prev === recordId ? null : recordId
    );

    setEditingRecord(null);
    setEditingFinancialRecord(null);
  };

  /* ============================================================
     PAYMENT STATUS
  ============================================================ */

  const getStatus = (amountPaid, requiredAmount) => {
    const paid = Number(amountPaid || 0);
    const required = Number(requiredAmount || 0);

    if (paid <= 0) return "unpaid";

    if (paid < required) return "partial";

    return "paid";
  };

  /* ============================================================
     OPEN PAYMENT RECORDING
  ============================================================ */

  const openPaymentRecording = (record) => {
    setEditingRecord({
      ...record,
      payments: (record.payments || []).map((payment) => ({
        ...payment,
        amountPaid: Number(payment.amountPaid || 0),
      })),
    });

    setExpandedRecord(null);
    setEditingFinancialRecord(null);

    setPaymentSearch("");
    setPaymentFilter("unpaid");
  };

  /* ============================================================
     UPDATE PAYMENT AMOUNT
  ============================================================ */

  const updatePaymentAmount = (paymentId, value) => {
    let numericValue =
      value === "" ? "" : Number(value);

    if (
      numericValue !== "" &&
      numericValue < 0
    ) {
      numericValue = 0;
    }

    if (
      numericValue !== "" &&
      numericValue > Number(editingRecord.amount)
    ) {
      numericValue = Number(editingRecord.amount);
    }

    const updatedPayments =
      editingRecord.payments.map((payment) =>
        payment._id === paymentId
          ? {
              ...payment,
              amountPaid: numericValue,
            }
          : payment
      );

    setEditingRecord({
      ...editingRecord,
      payments: updatedPayments,
    });
  };

  /* ============================================================
     QUICK PAYMENT ACTIONS
  ============================================================ */

  const markPaymentAsPaid = (paymentId) => {
    const updatedPayments =
      editingRecord.payments.map((payment) =>
        payment._id === paymentId
          ? {
              ...payment,
              amountPaid: Number(editingRecord.amount),
            }
          : payment
      );

    setEditingRecord({
      ...editingRecord,
      payments: updatedPayments,
    });
  };

  const markPaymentAsUnpaid = (paymentId) => {
    const updatedPayments =
      editingRecord.payments.map((payment) =>
        payment._id === paymentId
          ? {
              ...payment,
              amountPaid: 0,
            }
          : payment
      );

    setEditingRecord({
      ...editingRecord,
      payments: updatedPayments,
    });
  };

  /* ============================================================
     PAYMENT SUMMARY
  ============================================================ */

  const calculatePaymentSummary = (record) => {
    if (!record) {
      return {
        expectedAmount: 0,
        collectedAmount: 0,
        outstandingAmount: 0,
        paidMembers: 0,
        partialMembers: 0,
        unpaidMembers: 0,
      };
    }

    const payments = record.payments || [];

    const requiredAmount = Number(record.amount || 0);

    const expectedAmount =
      requiredAmount * payments.length;

    const collectedAmount = payments.reduce(
      (total, payment) =>
        total + Number(payment.amountPaid || 0),
      0
    );

    const outstandingAmount =
      expectedAmount - collectedAmount;

    const paidMembers = payments.filter(
      (payment) =>
        getStatus(
          payment.amountPaid,
          requiredAmount
        ) === "paid"
    ).length;

    const partialMembers = payments.filter(
      (payment) =>
        getStatus(
          payment.amountPaid,
          requiredAmount
        ) === "partial"
    ).length;

    const unpaidMembers = payments.filter(
      (payment) =>
        getStatus(
          payment.amountPaid,
          requiredAmount
        ) === "unpaid"
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

  /* ============================================================
     FILTER PAYMENT LIST
  ============================================================ */

  const filteredPayments = useMemo(() => {
    if (!editingRecord?.payments) {
      return [];
    }

    const normalizedSearch =
      paymentSearch.trim().toLowerCase();

    return editingRecord.payments.filter((payment) => {
      const memberName =
        payment.member?.name?.toLowerCase() || "";

      const memberPhone =
        payment.member?.phone?.toLowerCase() || "";

      const status = getStatus(
        payment.amountPaid,
        editingRecord.amount
      );

      const matchesSearch =
        !normalizedSearch ||
        memberName.includes(normalizedSearch) ||
        memberPhone.includes(normalizedSearch);

      const matchesFilter =
        paymentFilter === "all" ||
        status === paymentFilter;

      return matchesSearch && matchesFilter;
    });
  }, [
    editingRecord,
    paymentSearch,
    paymentFilter,
  ]);

  /* ============================================================
     SAVE ALL PAYMENTS
  ============================================================ */

  const handleSavePayments = async (recordId) => {
    if (!editingRecord) return;

    try {
      setPaymentSaveLoading(true);

      const updatedPayments =
        editingRecord.payments.map((payment) => ({
          ...payment,
          amountPaid: Number(payment.amountPaid || 0),
          status: getStatus(
            payment.amountPaid,
            editingRecord.amount
          ),
        }));

      await axios.put(`${API_URL}/${recordId}`, {
        ...editingRecord,
        payments: updatedPayments,
      });

      await fetchRecords();

      setEditingRecord(null);
      setPaymentSearch("");
      setPaymentFilter("unpaid");
    } catch (error) {
      console.error(error);
    } finally {
      setPaymentSaveLoading(false);
    }
  };

  /* ============================================================
     RECORD FILTERING
  ============================================================ */

  const filteredRecords = records.filter((record) => {
    const title =
      record.title?.toLowerCase() || "";

    const type =
      record.type?.toLowerCase() || "";

    const normalizedSearch =
      searchTerm.toLowerCase();

    const matchesSearch =
      title.includes(normalizedSearch) ||
      type.includes(normalizedSearch);

    const matchesFilter =
      filterType === "all"
        ? true
        : record.type === filterType;

    return matchesSearch && matchesFilter;
  });

  /* ============================================================
     EDIT FINANCIAL RECORD
  ============================================================ */

  const handleRecordUpdate = async () => {
    if (!editingFinancialRecord) return;

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

  /* ============================================================
     RENDER
  ============================================================ */

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

        {/* CREATE FORM */}

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showCreateForm
              ? "max-h-[900px] opacity-100 mb-6"
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
              className="space-y-5"
            >

              {/* TITLE */}

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

              {/* AMOUNT */}

              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  min="0"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                  required
                />
              </div>

              {/* CONTRIBUTION TYPE */}

              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-2">
                  Contribution Type
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

                  {[
                    {
                      value: "monthly",
                      label: "Monthly",
                      description: "Regular contribution",
                    },
                    {
                      value: "special",
                      label: "Special",
                      description: "One-time contribution",
                    },
                    {
                      value: "fine",
                      label: "Fine",
                      description: "Member penalty",
                    },
                  ].map((type) => {
                    const selected =
                      form.type === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            type: type.value,
                          })
                        }
                        className={`text-left border rounded-xl p-3 transition-all duration-200 ${
                          selected
                            ? "border-welfare-primary bg-welfare-primaryLight ring-2 ring-welfare-primary/20"
                            : "border-welfare-border bg-welfare-surface hover:border-welfare-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">

                          <span
                            className={`font-semibold text-sm ${
                              selected
                                ? "text-welfare-primary"
                                : "text-welfare-text-primary"
                            }`}
                          >
                            {type.label}
                          </span>

                          {selected && (
                            <span className="w-5 h-5 rounded-full bg-welfare-primary text-white text-xs flex items-center justify-center">
                              ✓
                            </span>
                          )}

                        </div>

                        <p className="text-xs text-welfare-text-muted mt-1">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}

                </div>

                <div className="mt-3 bg-welfare-background border border-welfare-border rounded-lg px-3 py-2.5">
                  <p className="text-xs text-welfare-text-secondary">
                    {form.type === "fine"
                      ? "Fines are not automatically assigned to every member."
                      : "This contribution will be prepared for all members, ready for payment recording."}
                  </p>
                </div>
              </div>

              {/* DEADLINE */}

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

              {/* SUBMIT */}

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

          <input
            type="text"
            placeholder="Search by title or contribution type..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full border border-welfare-border bg-welfare-surface px-4 py-3 rounded-xl text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition shadow-sm"
          />

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
                {records.length === 0
                  ? "💰"
                  : "🔎"}
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
              const summary =
                calculatePaymentSummary(record);

              return (
                <div
                  key={record._id}
                  className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6"
                >

                  {/* RECORD HEADER */}

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

                  {/* AMOUNT */}

                  <p className="text-2xl md:text-3xl font-bold text-welfare-text-primary mt-4">
                    Ksh{" "}
                    {Number(
                      record.amount || 0
                    ).toLocaleString()}
                  </p>

                  {/* FINANCIAL SUMMARY */}

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

                  {/* PAYMENT STATUS */}

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

                  {/* ACTIONS */}

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
                        openPaymentRecording(record)
                      }
                      className="text-sm font-medium text-welfare-primary hover:text-welfare-primaryDark transition-colors"
                    >
                      Record Payments
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
                      RECORD PAYMENTS
                  ================================================== */}

                  {editingRecord?._id === record._id && (
                    <div className="mt-5 pt-5 border-t border-welfare-border">

                      {/* HEADER */}

                      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">

                        <div>
                          <h3 className="text-lg font-semibold text-welfare-text-primary">
                            Record Payments
                          </h3>

                          <p className="text-sm text-welfare-text-secondary mt-1">
                            Mark members as paid or enter
                            partial payments.
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            setEditingRecord(null)
                          }
                          className="self-start lg:self-auto text-sm font-medium text-welfare-text-secondary hover:text-welfare-text-primary"
                        >
                          Close
                        </button>

                      </div>

                      {/* LIVE SUMMARY */}

                      {(() => {
                        const paymentSummary =
                          calculatePaymentSummary(
                            editingRecord
                          );

                        return (
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

                            <div className="bg-welfare-background border border-welfare-border rounded-xl p-3">
                              <p className="text-xs text-welfare-text-muted">
                                Members
                              </p>

                              <p className="text-lg font-bold text-welfare-text-primary mt-1">
                                {editingRecord.payments.length}
                              </p>
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                              <p className="text-xs text-welfare-success">
                                Paid
                              </p>

                              <p className="text-lg font-bold text-welfare-success mt-1">
                                {paymentSummary.paidMembers}
                              </p>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                              <p className="text-xs text-welfare-warning">
                                Partial
                              </p>

                              <p className="text-lg font-bold text-welfare-warning mt-1">
                                {paymentSummary.partialMembers}
                              </p>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                              <p className="text-xs text-welfare-danger">
                                Unpaid
                              </p>

                              <p className="text-lg font-bold text-welfare-danger mt-1">
                                {paymentSummary.unpaidMembers}
                              </p>
                            </div>

                          </div>
                        );
                      })()}

                      {/* SEARCH */}

                      <div className="bg-welfare-background border border-welfare-border rounded-xl p-4 mb-4">

                        <div className="flex flex-col lg:flex-row gap-3">

                          <input
                            type="text"
                            placeholder="Search member by name or phone..."
                            value={paymentSearch}
                            onChange={(e) =>
                              setPaymentSearch(
                                e.target.value
                              )
                            }
                            className="flex-1 border border-welfare-border bg-welfare-surface px-4 py-2.5 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                          />

                          <div className="flex flex-wrap gap-2">

                            {[
                              {
                                value: "all",
                                label: "All",
                              },
                              {
                                value: "unpaid",
                                label: "Unpaid",
                              },
                              {
                                value: "partial",
                                label: "Partial",
                              },
                              {
                                value: "paid",
                                label: "Paid",
                              },
                            ].map((filter) => (
                              <button
                                key={filter.value}
                                type="button"
                                onClick={() =>
                                  setPaymentFilter(
                                    filter.value
                                  )
                                }
                                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                                  paymentFilter ===
                                  filter.value
                                    ? "bg-welfare-primary text-white"
                                    : "bg-welfare-primaryLight text-welfare-primary hover:bg-welfare-primaryLight"
                                }`}
                              >
                                {filter.label}
                              </button>
                            ))}

                          </div>

                        </div>

                        <p className="text-xs text-welfare-text-muted mt-3">
                          Showing{" "}
                          {filteredPayments.length}{" "}
                          of{" "}
                          {editingRecord.payments.length}{" "}
                          members
                        </p>

                      </div>

                      {/* MEMBER PAYMENT LIST */}

                      {filteredPayments.length === 0 ? (
                        <div className="bg-welfare-background border border-welfare-border rounded-xl p-8 text-center">

                          <div className="w-12 h-12 mx-auto rounded-full bg-welfare-primaryLight flex items-center justify-center text-xl mb-3">
                            🔎
                          </div>

                          <h4 className="font-semibold text-welfare-text-primary">
                            No members found
                          </h4>

                          <p className="text-sm text-welfare-text-secondary mt-1">
                            Try changing the search or
                            payment filter.
                          </p>

                        </div>
                      ) : (
                        <div className="space-y-3">

                          {filteredPayments.map(
                            (payment) => {
                              const status =
                                getStatus(
                                  payment.amountPaid,
                                  editingRecord.amount
                                );

                              const amountPaid =
                                Number(
                                  payment.amountPaid || 0
                                );

                              const balance =
                                Number(
                                  editingRecord.amount
                                ) - amountPaid;

                              return (
                                <div
                                  key={payment._id}
                                  className="border border-welfare-border rounded-xl p-4 bg-welfare-background"
                                >

                                  {/* MEMBER INFO */}

                                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                    <div className="min-w-0">

                                      <div className="flex items-center gap-2 flex-wrap">

                                        <p className="font-semibold text-welfare-text-primary">
                                          {payment.member
                                            ?.name ||
                                            "Unknown Member"}
                                        </p>

                                        <span
                                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                            status ===
                                            "paid"
                                              ? "bg-green-50 text-welfare-success"
                                              : status ===
                                                "partial"
                                              ? "bg-orange-50 text-welfare-warning"
                                              : "bg-red-50 text-welfare-danger"
                                          }`}
                                        >
                                          {status}
                                        </span>

                                      </div>

                                      <p className="text-sm text-welfare-text-secondary mt-1">
                                        {payment.member
                                          ?.phone ||
                                          "No phone number"}
                                      </p>

                                    </div>

                                    {/* QUICK ACTION */}

                                    <div className="flex gap-2">

                                      {status !==
                                        "paid" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            markPaymentAsPaid(
                                              payment._id
                                            )
                                          }
                                          className="px-3 py-2 rounded-lg bg-green-50 text-welfare-success hover:bg-green-100 text-xs font-semibold transition"
                                        >
                                          Mark Paid
                                        </button>
                                      )}

                                      {status !==
                                        "unpaid" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            markPaymentAsUnpaid(
                                              payment._id
                                            )
                                          }
                                          className="px-3 py-2 rounded-lg bg-red-50 text-welfare-danger hover:bg-red-100 text-xs font-semibold transition"
                                        >
                                          Mark Unpaid
                                        </button>
                                      )}

                                    </div>

                                  </div>

                                  {/* PAYMENT INPUT */}

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

                                    <div className="md:col-span-2">

                                      <label className="block text-xs font-medium text-welfare-text-muted mb-1.5">
                                        Amount Paid
                                      </label>

                                      <input
                                        type="number"
                                        min="0"
                                        max={
                                          editingRecord.amount
                                        }
                                        value={
                                          payment.amountPaid ===
                                          ""
                                            ? ""
                                            : payment.amountPaid
                                        }
                                        onChange={(e) =>
                                          updatePaymentAmount(
                                            payment._id,
                                            e.target.value
                                          )
                                        }
                                        className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                                      />

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
                                        {Math.max(
                                          balance,
                                          0
                                        ).toLocaleString()}
                                      </p>

                                    </div>

                                  </div>

                                </div>
                              );
                            }
                          )}

                        </div>
                      )}

                      {/* =================================================
                          SAVE PAYMENT AREA
                      ================================================== */}

                      <div className="mt-5 pt-5 border-t border-welfare-border">

                        {(() => {
                          const paymentSummary =
                            calculatePaymentSummary(
                              editingRecord
                            );

                          return (
                            <div className="bg-welfare-primaryLight border border-welfare-primary/20 rounded-xl p-4">

                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                <div>

                                  <p className="text-sm font-semibold text-welfare-primary">
                                    Ready to save payments?
                                  </p>

                                  <p className="text-xs text-welfare-primary/80 mt-1">
                                    Collected: Ksh{" "}
                                    {paymentSummary.collectedAmount.toLocaleString()}{" "}
                                    · Outstanding: Ksh{" "}
                                    {paymentSummary.outstandingAmount.toLocaleString()}
                                  </p>

                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSavePayments(
                                      editingRecord._id
                                    )
                                  }
                                  disabled={
                                    paymentSaveLoading
                                  }
                                  className={`w-full lg:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition ${
                                    paymentSaveLoading
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-welfare-primary hover:bg-welfare-primaryDark"
                                  }`}
                                >
                                  {paymentSaveLoading
                                    ? "Saving Payments..."
                                    : "Save Payments"}
                                </button>

                              </div>

                            </div>
                          );
                        })()}

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

                        {/* TITLE */}

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

                        {/* AMOUNT */}

                        <div>
                          <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                            Amount
                          </label>

                          <input
                            type="number"
                            min="0"
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

                        {/* DEADLINE */}

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

                        <div className="flex flex-wrap gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              setEditingFinancialRecord(
                                null
                              )
                            }
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-welfare-text-secondary bg-welfare-background border border-welfare-border hover:bg-welfare-primaryLight transition"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
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

                      {!record.payments ||
                      record.payments.length === 0 ? (
                        <div className="bg-welfare-background border border-welfare-border rounded-xl p-8 text-center">

                          <div className="w-12 h-12 mx-auto rounded-full bg-welfare-primaryLight flex items-center justify-center text-xl mb-3">
                            💳
                          </div>

                          <h4 className="font-semibold text-welfare-text-primary">
                            No payment records
                          </h4>

                          <p className="text-sm text-welfare-text-secondary mt-1">
                            There are currently no member
                            payment records attached to
                            this financial record.
                          </p>

                        </div>
                      ) : (
                        <div className="space-y-2">

                          {record.payments.map(
                            (payment) => {
                              const status =
                                getStatus(
                                  payment.amountPaid,
                                  record.amount
                                );

                              return (
                                <div
                                  key={payment._id}
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-welfare-border rounded-xl p-4 bg-welfare-background"
                                >

                                  <div>
                                    <p className="font-semibold text-welfare-text-primary">
                                      {payment.member
                                        ?.name ||
                                        "Unknown Member"}
                                    </p>

                                    <p className="text-sm text-welfare-text-secondary mt-1">
                                      {payment.member
                                        ?.phone ||
                                        "No phone number"}
                                    </p>

                                    <p className="text-xs text-welfare-text-muted mt-1">
                                      Paid: Ksh{" "}
                                      {Number(
                                        payment.amountPaid ||
                                          0
                                      ).toLocaleString()}
                                    </p>
                                  </div>

                                  <span
                                    className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                      status === "paid"
                                        ? "bg-green-50 text-welfare-success"
                                        : status ===
                                          "partial"
                                        ? "bg-orange-50 text-welfare-warning"
                                        : "bg-red-50 text-welfare-danger"
                                    }`}
                                  >
                                    {status}
                                  </span>

                                </div>
                              );
                            }
                          )}

                        </div>
                      )}

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