import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([
    { id: 1, name: "Chippy (Snack)", category: "Snacks", price: 15, stock: 120 },
    { id: 2, name: "Coca-Cola 1L", category: "Drinks", price: 45, stock: 80 },
    { id: 3, name: "Rice 1kg", category: "Essentials", price: 60, stock: 200 },
    { id: 4, name: "Laundry Soap", category: "Essentials", price: 25, stock: 35 },
    { id: 5, name: "Vinegar 500ml", category: "Essentials", price: 20, stock: 18 },
    { id: 6, name: "SkyFlakes", category: "Snacks", price: 12, stock: 90 },
    { id: 7, name: "Bottled Water 500ml", category: "Drinks", price: 20, stock: 150 },
    { id: 8, name: "Eggs (1 Dozen)", category: "Essentials", price: 90, stock: 24 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Snacks",
    price: "",
    stock: "",
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    const id = products.length + 1;
    setProducts([
      ...products,
      {
        id,
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      },
    ]);
    setNewProduct({ name: "", category: "Snacks", price: "", stock: "" });
    setShowModal(false);
  };

  return (
    <div className="relative p-4 md:p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_6px_#FFD70060] text-center mb-8">
        Product Inventory
      </h2>

      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-[0_0_10px_#FFD70030]"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 backdrop-blur-md border border-yellow-400/20 rounded-3xl shadow-[0_0_15px_#FFD70020]">
        <table className="min-w-full divide-y divide-yellow-400/20">
          <thead className="bg-black/60 text-yellow-400 uppercase text-sm font-semibold tracking-wide">
            <tr>
              <th className="py-4 px-6 text-center">ID</th>
              <th className="py-4 px-6 text-left">Product Name</th>
              <th className="py-4 px-6 text-center">Category</th>
              <th className="py-4 px-6 text-center">Price (₱)</th>
              <th className="py-4 px-6 text-center">Stock</th>
              <th className="py-4 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-400/10">
            {products.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-yellow-100/5 transition duration-300"
              >
                <td className="py-4 px-6 text-center text-yellow-300">{p.id}</td>
                <td className="py-4 px-6 text-white font-medium">{p.name}</td>
                <td className="py-4 px-6 text-center text-gray-300">
                  {p.category}
                </td>
                <td className="py-4 px-6 text-center text-yellow-400 font-semibold">
                  ₱{p.price.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center text-gray-200">{p.stock}</td>
                <td className="py-4 px-6 text-center">
                  {p.stock <= 20 ? (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-semibold">
                      Low Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 text-xs font-semibold">
                      In Stock
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
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
                  Add New Product
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
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
                />
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 focus:outline-none focus:border-yellow-400"
                >
                  <option>Snacks</option>
                  <option>Drinks</option>
                  <option>Essentials</option>
                  <option>Others</option>
                </select>
                <input
                  type="number"
                  placeholder="Price (₱)"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
                />

                <button
                  onClick={handleAddProduct}
                  className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  Add Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
