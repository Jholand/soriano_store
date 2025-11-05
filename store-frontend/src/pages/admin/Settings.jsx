import { useState } from "react";

export default function Settings() {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Admin 1", email: "admin1@railynstore.com", role: "Super Admin" },
    { id: 2, name: "Admin 2", email: "admin2@railynstore.com", role: "Store Manager" },
    { id: 3, name: "Admin 3", email: "admin3@railynstore.com", role: "Assistant Admin" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "" });

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const newId = accounts.length ? accounts[accounts.length - 1].id + 1 : 1;
    setAccounts([...accounts, { id: newId, ...newAdmin }]);
    setNewAdmin({ name: "", email: "", role: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      setAccounts(accounts.filter((acc) => acc.id !== id));
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yellow-400 drop-shadow-[0_0_10px_#FFD70050]">
          Accounts
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 rounded-xl font-semibold hover:bg-yellow-500/30 transition"
        >
          + Add Admin
        </button>
      </div>

      <div className="overflow-x-auto bg-black/40 border border-yellow-400/20 rounded-2xl shadow-[0_0_15px_#FFD70020] backdrop-blur-md">
        <table className="min-w-full text-sm text-yellow-100">
          <thead>
            <tr className="bg-yellow-500/10 text-yellow-300 uppercase text-xs tracking-wider border-b border-yellow-500/20">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr
                key={acc.id}
                className="border-b border-yellow-400/10 hover:bg-yellow-400/5 transition-all"
              >
                <td className="px-6 py-3">{acc.id}</td>
                <td className="px-6 py-3">{acc.name}</td>
                <td className="px-6 py-3">{acc.email}</td>
                <td className="px-6 py-3">{acc.role}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  <button className="px-3 py-1 text-xs rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30">
                    View
                  </button>
                  <button className="px-3 py-1 text-xs rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="px-3 py-1 text-xs rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-yellow-400/30 rounded-2xl shadow-[0_0_20px_#FFD70040] p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
              Add New Admin
            </h3>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-yellow-400/30 text-yellow-100 focus:outline-none focus:border-yellow-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-yellow-400/30 text-yellow-100 focus:outline-none focus:border-yellow-400"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={newAdmin.role}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, role: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-black/40 border border-yellow-400/30 text-yellow-100 focus:outline-none focus:border-yellow-400"
                required
              />

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700/40 text-gray-300 rounded-lg hover:bg-gray-700/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 rounded-lg font-semibold hover:bg-yellow-500/30"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
