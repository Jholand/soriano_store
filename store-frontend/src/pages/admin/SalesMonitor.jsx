const sales = [
  { id: 101, item: "Rice 1kg", category: "Essentials", amount: 250, date: "2025-11-03" },
  { id: 102, item: "Coca-Cola 1L", category: "Drinks", amount: 90, date: "2025-11-03" },
  { id: 103, item: "Chippy (Snack)", category: "Snacks", amount: 60, date: "2025-11-03" },
  { id: 104, item: "Laundry Soap", category: "Essentials", amount: 50, date: "2025-11-03" },
  { id: 105, item: "Eggs (1 Dozen)", category: "Essentials", amount: 180, date: "2025-11-02" },
];

export default function SalesMonitor() {
  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_6px_#FFD70060] text-center mb-8">
        Sales Monitor
      </h2>

      <div className="overflow-x-auto bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 border border-yellow-400/20 rounded-3xl shadow-[0_0_15px_#FFD70020] backdrop-blur-md mb-6">
        <table className="min-w-full divide-y divide-yellow-400/20">
          <thead className="bg-black/60 text-yellow-400 uppercase text-sm font-semibold tracking-wide">
            <tr>
              <th className="py-4 px-6 text-center">Transaction ID</th>
              <th className="py-4 px-6 text-left">Item</th>
              <th className="py-4 px-6 text-center">Category</th>
              <th className="py-4 px-6 text-center">Amount (₱)</th>
              <th className="py-4 px-6 text-center">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-400/10">
            {sales.map((s) => (
              <tr key={s.id} className="hover:bg-yellow-100/5 transition duration-300">
                <td className="py-4 px-6 text-center text-yellow-300">{s.id}</td>
                <td className="py-4 px-6 text-white font-medium">{s.item}</td>
                <td className="py-4 px-6 text-center text-gray-300">{s.category}</td>
                <td className="py-4 px-6 text-center text-yellow-400 font-semibold">
                  ₱{s.amount.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center text-gray-400">{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center text-yellow-300 text-xl font-semibold">
        Total Sales:{" "}
        <span className="text-yellow-400 drop-shadow-[0_0_6px_#FFD70080]">
          ₱{totalSales.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
