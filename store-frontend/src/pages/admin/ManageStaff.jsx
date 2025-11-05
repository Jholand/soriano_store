import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function ManageStaff() {
  const [staff, setStaff] = useState([
    { id: 1, name: "Anna Dela Cruz", role: "Cashier", sales: 8500 },
    { id: 2, name: "Mark Reyes", role: "Inventory Clerk", sales: 6200 },
    { id: 3, name: "Rico Villanueva", role: "Sales Assistant", sales: 9400 },
    { id: 4, name: "Lara Gomez", role: "Cashier", sales: 7200 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", role: "", sales: "" });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.sales) return;

    const id = staff.length + 1;
    setStaff([...staff, { id, ...newStaff, sales: parseFloat(newStaff.sales) }]);
    setNewStaff({ name: "", role: "", sales: "" });
    setShowModal(false);
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white relative">
      <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_6px_#FFD70060] text-center mb-8">
        Manage Staff
      </h2>

      {/* Add Staff Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-[0_0_10px_#FFD70030]"
        >
          <FaPlus /> Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 border border-yellow-400/20 rounded-3xl shadow-[0_0_15px_#FFD70020] backdrop-blur-md">
        <table className="min-w-full divide-y divide-yellow-400/20">
          <thead className="bg-black/60 text-yellow-400 uppercase text-sm font-semibold tracking-wide">
            <tr>
              <th className="py-4 px-6 text-center">Staff ID</th>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-center">Role</th>
              <th className="py-4 px-6 text-center">Sales (₱)</th>
              <th className="py-4 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-400/10">
            {staff.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-yellow-100/5 transition duration-300"
              >
                <td className="py-4 px-6 text-center text-yellow-300">{s.id}</td>
                <td className="py-4 px-6 font-medium text-white">{s.name}</td>
                <td className="py-4 px-6 text-center text-gray-300">{s.role}</td>
                <td className="py-4 px-6 text-center text-yellow-400 font-semibold">
                  ₱{s.sales.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 text-xs font-semibold">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-gray-950 to-black border border-yellow-400/20 rounded-2xl p-6 w-[90%] max-w-md shadow-[0_0_20px_#FFD70030]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yellow-300">
                  Add New Staff
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-yellow-400 hover:text-yellow-200"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newStaff.role}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, role: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
                />
                <input
                  type="number"
                  placeholder="Sales (₱)"
                  value={newStaff.sales}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, sales: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
                />

                <button
                  onClick={handleAddStaff}
                  className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  Add Staff
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
