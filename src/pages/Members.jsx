import { useEffect, useState, useRef } from "react";
import axios from "axios";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    idNumber: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const membersSectionRef = useRef(null);

  const API_URL = "http://localhost:5000/api/members";

  // Fetch members
  const fetchMembers = async () => {
    try {
      const res = await axios.get(API_URL);
      setMembers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        membersSectionRef.current &&
        !membersSectionRef.current.contains(event.target)
      ) {
        setSelectedMember(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Add / Edit member
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      await fetchMembers();

      setSelectedMember(null);

      setForm({
        name: "",
        phone: "",
        idNumber: "",
      });

      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };

  // Delete member
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMembers();
    } catch (error) {
      console.error(error);
    }
  };

  // Edit member
  const handleEdit = (member) => {
    setForm({
      name: member.name,
      phone: member.phone,
      idNumber: member.idNumber,
    });

    setEditingId(member._id);
    setShowForm(true);
  };

  // Filter members
  const filteredMembers = members.filter(
    (member) =>
      member.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.idNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-welfare-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-welfare-text-primary">
            Members
          </h1>

          <p className="text-welfare-text-secondary mt-2">
            Manage welfare group members and their information.
          </p>
        </div>

        {/* Add Member Trigger */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);

              if (showForm) {
                setEditingId(null);
                setForm({
                  name: "",
                  phone: "",
                  idNumber: "",
                });
              }
            }}
            className="bg-welfare-primary hover:bg-welfare-primaryDark text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200"
          >
            {showForm
              ? "Cancel"
              : editingId
              ? "+ Edit Member"
              : "+ Add Member"}
          </button>
        </div>

        {/* Add / Edit Member Form */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showForm
              ? "max-h-[500px] opacity-100 mb-6"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-5 md:p-6">
            <div className="mb-5">
              <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
                {editingId ? "Edit Member" : "Add Member"}
              </h2>

              <p className="text-sm text-welfare-text-secondary mt-1">
                {editingId
                  ? "Update the member's information below."
                  : "Add a new member to your welfare group."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter member name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                  ID Number
                </label>

                <input
                  type="text"
                  name="idNumber"
                  placeholder="Enter ID number"
                  value={form.idNumber}
                  onChange={handleChange}
                  className="w-full border border-welfare-border bg-welfare-surface px-3 py-2.5 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-welfare-primary hover:bg-welfare-primaryDark text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200"
                >
                  {editingId
                    ? "Save Changes"
                    : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or ID number..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-welfare-surface border border-welfare-border px-4 py-3 rounded-xl text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition shadow-sm"
            />
          </div>
        </div>

        {/* Members Section */}
        <div
          ref={membersSectionRef}
          className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-5 md:p-6"
        >
          <div className="mb-5">
            <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
              Members
            </h2>

            <p className="text-sm text-welfare-text-secondary mt-1">
              {searchTerm
                ? `Showing ${filteredMembers.length} of ${members.length} members`
                : `${members.length} ${
                    members.length === 1
                      ? "member"
                      : "members"
                  }`}
            </p>
          </div>

          {/* Members List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-10 h-10 border-4 border-welfare-border border-t-welfare-primary rounded-full animate-spin mb-4"></div>

              <p className="text-welfare-text-secondary font-medium">
                Loading members...
              </p>

              <p className="text-sm text-welfare-text-muted mt-1">
                Please wait while we fetch the member list.
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-welfare-primaryLight flex items-center justify-center text-2xl mb-4">
                👥
              </div>

              <h3 className="text-lg font-semibold text-welfare-text-primary">
                No members yet
              </h3>

              <p className="text-sm text-welfare-text-secondary mt-1">
                Add your first member to get started.
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-welfare-primaryLight flex items-center justify-center text-2xl mb-4">
                🔎
              </div>

              <h3 className="text-lg font-semibold text-welfare-text-primary">
                No members found
              </h3>

              <p className="text-sm text-welfare-text-secondary mt-1">
                Try searching with a different name or ID number.
              </p>
            </div>
          ) : (
            <ul className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {filteredMembers.map((member) => {
                const isSelected =
                  selectedMember?._id === member._id;

                return (
                  <li
                    key={member._id}
                    onClick={() =>
                      setSelectedMember(member)
                    }
                    className={`border rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-welfare-primary bg-welfare-primaryLight shadow-sm"
                        : "border-welfare-border bg-welfare-surface hover:border-welfare-primary/40 hover:shadow-sm"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold text-welfare-text-primary truncate">
                            {member.name}
                          </p>

                          <p className="text-welfare-text-secondary mt-1">
                            {member.phone ||
                              "No phone number"}
                          </p>

                          <p className="text-sm text-welfare-text-muted mt-1">
                            ID: {member.idNumber}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="shrink-0 px-2.5 py-1 rounded-full bg-welfare-surface text-welfare-primary font-semibold text-xs">
                            Selected
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className="border-t border-welfare-primary/20 mt-4 pt-4 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(member);
                            }}
                            className="bg-welfare-primary hover:bg-welfare-primaryDark text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Edit Member
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(member._id);
                            }}
                            className="bg-red-50 hover:bg-red-100 text-welfare-danger px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default Members;