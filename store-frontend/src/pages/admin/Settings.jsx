import { useState, useEffect } from "react";
import { FaUserCircle, FaEdit, FaLock, FaEye, FaEyeSlash, FaSearch, FaToggleOn, FaToggleOff, FaTrash } from "react-icons/fa";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination";

export default function Settings() {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Current logged-in user (mock for now - in production get from auth context)
  const [currentUser, setCurrentUser] = useState({
    name: "Rai Lyn Soriano",
    email: "railyn@store.com",
    role: "admin",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ ...currentUser });
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "admin",
    is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAdmin, setViewAdmin] = useState(null);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter only admin users
      const adminUsers = response.data.filter((user) => user.role === "admin");
      setAdmins(adminUsers);
      setFilteredAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admin accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAdmins(filtered);
    setCurrentPage(1);
  }, [searchQuery, admins]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      id: null,
      name: "",
      email: "",
      password: "",
      role: "admin",
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setIsEditMode(true);
    setFormData({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
      is_active: admin.is_active,
    });
    setShowModal(true);
  };

  const openViewModal = (admin) => {
    setViewAdmin(admin);
    setShowViewModal(true);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update existing admin
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active,
        };
        
        // Only include password if it's provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        const token = localStorage.getItem("token");
        await axios.put(
          `/api/users/${formData.id}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Admin updated successfully!");
      } else {
        // Add new admin
        const token = localStorage.getItem("token");
        await axios.post("/api/users", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          is_active: formData.is_active,
        }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Admin added successfully!");
      }

      setShowModal(false);
      setFormData({
        id: null,
        name: "",
        email: "",
        password: "",
        role: "admin",
        is_active: true,
      });
      fetchAdmins();
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error(
        error.response?.data?.message || "Failed to save admin account"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Admin deleted successfully!");
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin account");
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser(editProfileData);
    setIsEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-10 p-6 bg-white min-h-screen text-gray-900">
      {/* CURRENTLY LOGGED-IN ADMIN SECTION */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 relative">
        <FaUserCircle className="text-yellow-400 text-7xl" />
        <div>
          <h3 className="text-2xl font-bold text-yellow-500">{currentUser.name}</h3>
          <p className="text-gray-600">{currentUser.email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-sm rounded-lg bg-blue-500/20 text-blue-400 capitalize">
            {currentUser.role}
          </span>
        </div>
        <button
          onClick={() => {
            setEditProfileData({ ...currentUser });
            setIsEditingProfile(true);
          }}
          className="absolute top-4 right-4 flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-400 shadow-md hover:from-yellow-200 hover:to-yellow-100 px-3 py-2 rounded-xl text-sm transition-all font-medium"
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      {/* ADMIN ACCOUNTS HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-white">
          Admin Accounts
        </h2>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-semibold transition-all whitespace-nowrap shadow-lg shadow-yellow-400/20 text-sm"
          >
            + Add Admin
          </button>
        </div>
      </div>

      {/* ADMIN ACCOUNTS TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-900">
            <thead>
              <tr className="bg-white text-gray-400 uppercase text-xs tracking-wider border-b border-gray-200">
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-700">
                    Loading admin accounts...
                  </td>
                </tr>
              ) : currentAdmins.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600 text-sm">
                    {searchQuery ? "No admins found matching your search" : "No admin accounts yet"}
                  </td>
                </tr>
              ) : (
              currentAdmins.map((admin, index) => (
                <tr
                  key={admin.id}
                  className="border-b border-gray-200 hover:bg-gray-700/30 transition-all"
                >
                  <td className="px-6 py-3 text-gray-700">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-3 text-gray-900 font-semibold">{admin.name}</td>
                  <td className="px-6 py-3 text-gray-700">{admin.email}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 text-xs rounded-lg bg-blue-500/20 text-blue-400 capitalize">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {admin.is_active ? (
                      <span className="text-green-400 text-lg">
                        <FaToggleOn />
                      </span>
                    ) : (
                      <span className="text-red-400 text-lg">
                        <FaToggleOff />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-400">
                    {new Date(admin.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <button
                      onClick={() => openViewModal(admin)}
                      className="px-3 py-1 text-xs rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(admin)}
                      className="px-3 py-1 text-xs rounded-lg bg-gray-400/20 text-gray-700 hover:bg-green-500/20 hover:text-green-400 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="px-3 py-1 text-xs rounded-lg bg-gray-400/20 text-gray-700 hover:bg-red-500/20 hover:text-red-400 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* PAGINATION */}
      {!loading && filteredAdmins.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAdmins.length}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      )}

      {/* ADD/EDIT ADMIN MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-400/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isEditMode ? "Edit Admin Account" : "Add New Admin"}
            </h3>

            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value="Admin"
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password {isEditMode && "(Leave blank to keep current)"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isEditMode ? "Enter new password" : "Set password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 pr-10 text-sm"
                    required={!isEditMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Account Status
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_active: !formData.is_active })
                  }
                  className={`w-full px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm ${
                    formData.is_active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {formData.is_active ? (
                    <>
                      <FaToggleOn className="text-xl" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <FaToggleOff className="text-xl" />
                      <span>Inactive</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      id: null,
                      name: "",
                      email: "",
                      password: "",
                      role: "admin",
                      is_active: true,
                    });
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-900 rounded-xl transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-semibold transition-all shadow-lg shadow-yellow-400/20 text-sm"
                >
                  {isEditMode ? "Update Admin" : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ADMIN MODAL */}
      {showViewModal && viewAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-400/10 p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Admin Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <FaUserCircle className="text-yellow-400 text-6xl" />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wide">
                    Name
                  </label>
                  <p className="text-white text-lg font-medium">
                    {viewAdmin.name}
                  </p>
                </div>

                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-gray-700">{viewAdmin.email}</p>
                </div>

                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wide">
                    Role
                  </label>
                  <p className="text-gray-700 capitalize">{viewAdmin.role}</p>
                </div>

                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wide">
                    Status
                  </label>
                  <p className="flex items-center gap-2 mt-1">
                    {viewAdmin.is_active ? (
                      <>
                        <FaToggleOn className="text-green-400 text-xl" />
                        <span className="text-green-400">Active</span>
                      </>
                    ) : (
                      <>
                        <FaToggleOff className="text-red-400 text-xl" />
                        <span className="text-red-400">Inactive</span>
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wide">
                    Joined
                  </label>
                  <p className="text-gray-700">
                    {new Date(viewAdmin.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-yellow-400/70 text-xs uppercase tracking-wide">
                    Last Updated
                  </label>
                  <p className="text-yellow-100">
                    {new Date(viewAdmin.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-yellow-400/20">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewAdmin(null);
                  }}
                  className="px-4 py-2 bg-gray-700/40 text-gray-700 rounded-lg hover:bg-gray-700/60 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(viewAdmin);
                  }}
                  className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 rounded-lg font-semibold hover:bg-yellow-500/30 transition"
                >
                  Edit Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-400/10 p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Edit Profile Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={editProfileData.name}
                  onChange={(e) =>
                    setEditProfileData({ ...editProfileData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={editProfileData.email}
                  onChange={(e) =>
                    setEditProfileData({ ...editProfileData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={editProfileData.role}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 cursor-not-allowed capitalize text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  New Password (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    placeholder="Leave blank to keep current password"
                    value={editProfileData.password || ""}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showEditPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-900 rounded-xl transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-semibold transition-all shadow-lg shadow-yellow-400/20 text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}