import { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaEdit, FaTrash, FaSearch, FaEye, FaEyeSlash, FaUserTie, FaToggleOn, FaToggleOff } from "react-icons/fa";
import axios from "../../utils/axios";
import Pagination from "../../components/Pagination";
import { toast } from "react-hot-toast";

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    is_active: true
  });

  // Fetch staff/users
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filtered staff (exclude admin users)
  const filteredStaff = staff.filter((s) => 
    s.role !== 'admin' &&
    (s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isEditing && !formData.password) {
      toast.error("Password is required for new staff");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditing && selectedStaff) {
        // Update existing staff
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active
        };
        
        // Only include password if it's being changed
        if (formData.password) {
          updateData.password = formData.password;
          updateData.password_confirmation = formData.password;
        }

        const response = await axios.put(
          `/api/users/${selectedStaff.id}`,
          updateData,
          config
        );
        
        setStaff(staff.map((s) => (s.id === selectedStaff.id ? response.data : s)));
        toast.success("Staff updated successfully!");
      } else {
        // Add new staff
        const response = await axios.post("/api/users", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password,
          role: formData.role,
          is_active: formData.is_active
        }, config);
        
        setStaff([...staff, response.data]);
        toast.success("Staff added successfully!");
      }

      setFormData({ name: "", email: "", password: "", role: "staff", is_active: true });
      setIsEditing(false);
      setSelectedStaff(null);
      setShowModal(false);
      setShowPassword(false);
    } catch (error) {
      console.error("Error saving staff:", error);
      toast.error(error.response?.data?.message || "Failed to save staff");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(staff.filter((s) => s.id !== id));
      toast.success("Staff deleted successfully!");
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(error.response?.data?.message || "Failed to delete staff");
    }
  };

  const handleEdit = (s) => {
    setFormData({
      name: s.name,
      email: s.email,
      password: "",
      role: s.role || "staff",
      is_active: s.is_active !== undefined ? s.is_active : true
    });
    setSelectedStaff(s);
    setIsEditing(true);
    setShowModal(true);
    setShowPassword(false);
  };

  const handleToggleActive = async (id) => {
    try {
      const staffMember = staff.find(s => s.id === id);
      if (!staffMember) return;

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/users/${id}`,
        {
          name: staffMember.name,
          email: staffMember.email,
          role: staffMember.role,
          is_active: !staffMember.is_active
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStaff(staff.map(s => s.id === id ? response.data : s));
      toast.success(`Staff ${response.data.is_active ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error("Error toggling staff status:", error);
      toast.error(error.response?.data?.message || "Failed to update staff status");
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", email: "", password: "", role: "staff", is_active: true });
    setIsEditing(false);
    setSelectedStaff(null);
    setShowModal(true);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-white text-gray-900">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2 flex items-center gap-3">
          <FaUserTie /> Staff Management
        </h2>
        <p className="text-gray-600 text-sm">Manage staff accounts and permissions</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <p className="text-gray-600 text-sm mb-1">Total Staff Members</p>
        <p className="text-3xl font-bold text-gray-900">{filteredStaff.length}</p>
      </div>

      {/* Search Bar and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-700 pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg shadow-yellow-400/20"
        >
          <FaPlus /> Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200">
              <tr className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 text-left font-medium w-16">#</th>
                <th className="py-3 px-4 text-left font-medium">Name</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-center font-medium">Role</th>
                <th className="py-3 px-4 text-center font-medium">Status</th>
                <th className="py-3 px-4 text-center font-medium">Joined</th>
                <th className="py-3 px-4 text-center font-medium w-32">Actions</th>
              </tr>
            </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400">Loading staff...</span>
                  </div>
                </td>
              </tr>
            ) : currentStaff.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-600 italic text-sm font-medium">
                  {filteredStaff.length === 0 && staff.length > 0
                    ? `No staff found matching "${searchQuery}"`
                    : "No staff members available"}
                </td>
              </tr>
            ) : (
              currentStaff.map((s, index) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-200 hover:bg-gray-700/30 transition-all"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">{indexOfFirstItem + index + 1}</td>
                  <td className="py-3 px-4 text-gray-900 font-semibold text-sm">{s.name}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{s.email}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.role === 'admin' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {s.role?.toUpperCase() || 'STAFF'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(s.id)}
                      className="flex items-center justify-center mx-auto"
                    >
                      {s.is_active ? (
                        <FaToggleOn className="text-green-400 text-2xl hover:text-green-300 transition-colors" />
                      ) : (
                        <FaToggleOff className="text-red-400 text-2xl hover:text-red-300 transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400 text-sm">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-gray-400 hover:text-yellow-400 transition-colors p-2 text-lg"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-2 text-lg"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredStaff.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredStaff.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-400/10 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Staff Member" : "Add New Staff"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-900 text-2xl transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddOrUpdate} className="p-6 space-y-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value="Staff"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                    className="flex items-center mx-auto"
                  >
                    {formData.is_active ? (
                      <FaToggleOn className="text-green-400 text-3xl hover:text-green-300 transition-colors" />
                    ) : (
                      <FaToggleOff className="text-red-400 text-3xl hover:text-red-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Password {!isEditing && <span className="text-red-400">*</span>}
                  {isEditing && <span className="text-gray-500 text-xs ml-2">(Leave blank to keep current)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isEditing ? "Enter new password..." : "Enter password..."}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 pr-12 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
                    required={!isEditing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg shadow-yellow-400/20"
                >
                  {isEditing ? "Update Staff" : "Add Staff"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-900 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
