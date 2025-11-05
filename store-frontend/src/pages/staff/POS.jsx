import { useState } from "react";
import { FaPlus, FaTrashAlt, FaShoppingCart, FaBoxOpen } from "react-icons/fa";

export default function POS() {
  const [cart, setCart] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const products = [
    { id: 1, name: "Chippy (Snack)", price: 15 },
    { id: 2, name: "Coca-Cola 1L", price: 45 },
    { id: 3, name: "Rice 1kg", price: 60 },
    { id: 4, name: "Laundry Soap", price: 25 },
    { id: 5, name: "Vinegar 500ml", price: 20 },
    { id: 6, name: "SkyFlakes", price: 12 },
    { id: 7, name: "Bottled Water 500ml", price: 20 },
    { id: 8, name: "Eggs (1 Dozen)", price: 90 },
  ];

  const handleAddToCart = () => {
    if (!productName || !quantity || !selectedPrice) return;

    const total = selectedPrice * quantity;

    const newItem = {
      id: cart.length + 1,
      name: productName,
      qty: parseInt(quantity),
      price: selectedPrice,
      total,
    };

    setCart([...cart, newItem]);
    setProductName("");
    setQuantity("");
    setSelectedPrice("");
  };

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  const handleSelectProduct = (product) => {
    setProductName(product.name);
    setSelectedPrice(product.price);
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_6px_#FFD70060] text-center mb-8">
        Point of Sale (POS)
      </h2>

      <div className="max-w-5xl mx-auto bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 backdrop-blur-md border border-yellow-400/20 rounded-3xl shadow-[0_0_15px_#FFD70020] p-8">
        {/* Product List Section */}
        <h3 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
          <FaBoxOpen /> Available Products
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-black/40 border border-yellow-400/20 rounded-xl p-4 text-center hover:shadow-[0_0_10px_#FFD70030] transition-all"
            >
              <p className="text-yellow-300 font-semibold">{product.name}</p>
              <p className="text-yellow-500 text-sm mb-3">₱{product.price}</p>
              <button
                onClick={() => handleSelectProduct(product)}
                className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 text-sm py-1 px-3 rounded-lg transition-all hover:scale-105"
              >
                + Add
              </button>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="space-y-5">
          <div>
            <label className="block text-yellow-300 font-medium mb-2">
              Product Name
            </label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-yellow-300 font-medium mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-yellow-300 font-medium mb-2">
              Price (₱)
            </label>
            <input
              type="number"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(Number(e.target.value))}
              placeholder="Enter price"
              className="w-full px-4 py-2 bg-black/40 border border-yellow-400/30 rounded-lg text-yellow-200 placeholder-yellow-500/50 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 py-2 rounded-lg font-semibold transition-all hover:scale-105 shadow-[0_0_10px_#FFD70030]"
          >
            <FaPlus /> Add to Cart
          </button>
        </div>

        {/* Cart Summary */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <FaShoppingCart /> Cart Summary
          </h3>

          {cart.length === 0 ? (
            <p className="text-gray-400 italic text-center py-6">
              No items in cart yet.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-yellow-400/20">
              <table className="min-w-full text-sm">
                <thead className="bg-black/50 text-yellow-300 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-center">Price</th>
                    <th className="px-4 py-3 text-center">Total</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/10">
                  {cart.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-yellow-100/5 transition-all"
                    >
                      <td className="px-4 py-3 text-yellow-100">{item.name}</td>
                      <td className="px-4 py-3 text-center">{item.qty}</td>
                      <td className="px-4 py-3 text-center text-yellow-400">
                        ₱{item.price}
                      </td>
                      <td className="px-4 py-3 text-center text-yellow-300 font-semibold">
                        ₱{item.total}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Total + Checkout */}
          {cart.length > 0 && (
            <div className="mt-6 border-t border-yellow-400/20 pt-4">
              <div className="flex justify-between text-lg font-semibold text-yellow-300">
                <span>Total:</span>
                <span>₱{totalAmount.toLocaleString()}</span>
              </div>
              <button className="w-full mt-5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 py-2 rounded-lg font-semibold transition-all hover:scale-105">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
