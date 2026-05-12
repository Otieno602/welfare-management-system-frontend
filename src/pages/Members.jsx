import { useEffect, useState } from "react";
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

  const API_URL = "http://localhost:5000/api/members";

  // Fetch members
  const fetchMembers = async () => {
    try {
      const res = await axios.get(API_URL);
      setMembers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add member
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        // CREATE
        await axios.post(API_URL, form);
      }

      setForm({ name: "", phone: "", idNumber: "" });
      setEditingId(null);
      fetchMembers();
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Delete Member
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

// Edit Member
const handleEdit = (member) => {
  setForm({
    name: member.name,
    phone: member.phone,
    idNumber: member.idNumber,
  });

  setEditingId(member._id);
};

// Filter Members
const filteredMembers = members.filter((member) =>
  member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  member.idNumber.includes(searchTerm)
);

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Members</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={form.idNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Member
        </button>
      </form>

      {/* Members List */}
      <ul className="space-y-2">
          <input
            type="text"
            placeholder="Search by name or ID number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
        {filteredMembers.map((member) => (
          <li key={member._id} className="border border-gray-200 shadow-sm p-4 rounded-lg bg-white">
            <p className="text-lg font-semibold">{member.name}</p>
            <p className='text-gray-600'>{member.phone}</p>
            <p className="text-sm text-gray-500">
              ID: {member.idNumber}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(member)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(member._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;