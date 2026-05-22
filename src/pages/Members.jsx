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
  const membersSectionRef = useRef(null);

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
    <div className="h-screen overflow-hidden p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Members</h1>

      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-80px)]">

        {/* Form */}
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Member" : "Add Member"}
        </h2>

        <div className="md:w-1/3 bg-white shadow-sm border rounded-lg p-4 h-fit">
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="text"
              name="idNumber"
              placeholder="ID Number"
              value={form.idNumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              {editingId ? "Save Changes" : "Add Member"}
            </button>
          </form>
        </div> 

          {/* Search */}
          <div
            ref={membersSectionRef} 
            className="md:w-2/3 flex flex-col overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search by name or ID number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            {/* Members List */}
            <ul className="space-y-3 overflow-y-auto flex-1 pr-2">
              {selectedMember && (
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">
                    Selected: {selectedMember.name}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(selectedMember)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMember._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            {filteredMembers.map((member) => (
              <li
                key={member._id}
                onClick={() => setSelectedMember(member)}
                className={`border shadow-sm p-4 rounded-lg cursor-pointer transition ${
                selectedMember?._id === member._id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-lg font-semibold">{member.name}</p>

                <p className="text-gray-600">{member.phone}</p>

                <p className="text-sm text-gray-500">
                  ID: {member.idNumber}
                </p>
              </li>
            ))}
          </ul>
        </div>  
      </div>
    </div>
  );
};

export default Members;