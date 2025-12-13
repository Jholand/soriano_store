import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch } from "react-icons/fa";
import axios from "../../utils/axios";
import Pagination from "../../components/Pagination";
import { toast } from "../../components/Toast";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/categories');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleAdd = async () => {
    if (!newCategory.trim() || !newDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      const response = await axios.post('/api/categories', {
        name: newCategory,
        description: newDescription,
        is_active: true
      });
      
      setCategories([...categories, response.data]);
      setNewCategory("");
      setNewDescription("");
      setShowModal(false);
      toast.success("Category added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
      console.error('Error:', err);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
      console.error('Error:', err);
    }
  };

  // Edit category
  const handleEdit = (id) => {
    const cat = categories.find((c) => c.id === id);
    setEditing(id);
    setEditName(cat.name);
    setEditDescription(cat.description);
  };

  const handleSave = async (id) => {
    if (!editName.trim() || !editDescription.trim()) {
      toast.error("Name and description cannot be empty");
      return;
    }
    
    try {
      const cat = categories.find((c) => c.id === id);
      const response = await axios.put(`/api/categories/${id}`, {
        name: editName.trim(),
        description: editDescription.trim(),
        is_active: cat.is_active
      });

      setCategories(
        categories.map((c) =>
          c.id === id ? response.data : c
        )
      );
      setEditing(null);
      toast.success("Category updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
      console.error('Error:', err);
    }
  };

  // Toggle is_active status
  const handleToggleActive = async (id) => {
    try {
      const cat = categories.find((c) => c.id === id);
      const response = await axios.put(`/api/categories/${id}`, {
        name: cat.name,
        description: cat.description,
        is_active: !cat.is_active
      });

      setCategories(
        categories.map((c) =>
          c.id === id ? response.data : c
        )
      );
      toast.success(`Category ${response.data.is_active ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle status');
      console.error('Error:', err);
    }
  };

  // Pagination calculations
  const filteredCategories = categories.filter((cat) => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen p-6 md:p-8 bg-white text-gray-900">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          Categories
        </h2>
        <p className="text-gray-600 text-sm">Manage product categories</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Bar and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-700 pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg shadow-yellow-400/20"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200">
              <tr className="text-sm text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-medium w-16">#</th>
                <th className="py-3 px-4 text-left font-medium">Category Name</th>
                <th className="py-3 px-4 text-left font-medium">Description</th>
                <th className="py-3 px-4 text-center font-medium w-24">Status</th>
                <th className="py-3 px-4 text-center font-medium w-32">Actions</th>
              </tr>
            </thead>
          <tbody>
            {currentCategories.map((cat, index) => (
              <tr
                key={cat.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-all"
              >
                <td className="py-3 px-4 text-sm text-gray-700">{indexOfFirstItem + index + 1}</td>
                <td className="py-3 px-4">
                  {editing === cat.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-900 w-full focus:outline-none focus:border-yellow-400/50 text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{cat.name}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editing === cat.id ? (
                    <input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-lg text-gray-900 w-full focus:outline-none focus:border-yellow-400/50 text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">{cat.description}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleToggleActive(cat.id)}
                    disabled={editing === cat.id}
                    className="flex items-center justify-center mx-auto disabled:opacity-50"
                  >
                    {cat.is_active ? (
                      <FaToggleOn className="text-green-400 text-2xl hover:text-green-300 transition-colors" />
                    ) : (
                      <FaToggleOff className="text-red-400 text-2xl hover:text-red-300 transition-colors" />
                    )}
                  </button>
                </td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  {editing === cat.id ? (
                    <button
                      onClick={() => handleSave(cat.id)}
                      className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-all font-medium text-sm"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(cat.id)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors text-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors text-lg"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400">Loading categories...</span>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic text-sm"
                >
                  No categories available.
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic text-sm"
                >
                  No categories found matching "{searchQuery}"
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredCategories.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredCategories.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-400/10 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Add New Category
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
                />
              </div>
              
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  placeholder="Enter category description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 resize-none text-sm"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg shadow-yellow-400/20"
                >
                  Add Category
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
