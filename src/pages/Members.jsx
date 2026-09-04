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
    setForm({ ...form, [e.target.name]: e.target.value });
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

  // Add member
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      // Refresh members from the database
      await fetchMembers();

      // Clear the selected member
      setSelectedMember(null);

      // Reset form
      setForm({
        name: "",
        phone: "",
        idNumber: "",
      });

      // Exit edit mode
      setEditingId(null);

      // Close form
      setShowForm(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Delete Member
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMembers();
    } catch (error) {
      console.error(error);
    }
  };

  // Edit Member
  const handleEdit = (member) => {
    setForm({
      name: member.name,
      phone: member.phone,
      idNumber: member.idNumber,
    });

    setEditingId(member._id);
    setShowForm(true);
  };

  // Filter Members
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.idNumber.includes(searchTerm),
  );

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Members</h1>

          <p className="text-gray-500 mt-2">
            Manage welfare group members and their information.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6 mb-8">
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
          >
            {showForm ? "Cancel" : editingId ? "+ Edit Member" : "+ Add Member"}
          </button>
        </div>
      </div>

      {/* Add / Edit Member Form */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showForm ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Member" : "Add Member"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="idNumber"
              placeholder="ID Number"
              value={form.idNumber}
              onChange={handleChange}
              className="w-full border border-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
            >
              {editingId ? "Save Changes" : "Add Member"}
            </button>
          </form>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or ID number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Members Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Members</h2>

            <p className="text-sm text-gray-500 mt-1">
              {searchTerm
                ? `Showing ${filteredMembers.length} of ${members.length} members`
                : `${members.length} ${members.length === 1 ? "member" : "members"}`}
            </p>
          </div>
        </div>

        {/* Members List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>

            <p className="text-gray-600 font-medium">Loading members...</p>

            <p className="text-sm text-gray-400 mt-1">
              Please wait while we fetch the member list.
            </p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-4">👥</div>

            <h3 className="text-lg font-semibold text-gray-800">
              No members yet
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Add your first member to get started.
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-4">🔎</div>

            <h3 className="text-lg font-semibold text-gray-800">
              No members found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try searching with a different name or ID number.
            </p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {filteredMembers.map((member) => {
              const isSelected = selectedMember?._id === member._id;

              return (
                <li
                  key={member._id}
                  onClick={() => setSelectedMember(member)}
                  className={`border rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {member.name}
                        </p>

                        <p className="text-gray-600 mt-1">
                          {member.phone || "No phone number"}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          ID: {member.idNumber}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="text-blue-600 font-semibold text-sm">
                          Selected
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="border-t border-blue-200 mt-4 pt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(member);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                        >
                          Edit Member
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(member._id);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
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
  );
};

export default Members;
