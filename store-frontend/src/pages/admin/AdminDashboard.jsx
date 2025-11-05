import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  FaBoxOpen,
  FaChartLine,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function AdminDashboard() {
  const salesData = [
    { name: "Jan", sales: 12000 },
    { name: "Feb", sales: 18500 },
    { name: "Mar", sales: 23500 },
    { name: "Apr", sales: 19800 },
    { name: "May", sales: 27800 },
  ];

  const productData = [
    { name: "Snacks", value: 300 },
    { name: "Drinks", value: 200 },
    { name: "Essentials", value: 150 },
    { name: "Others", value: 100 },
  ];

  const staffData = [
    { name: "Anna", sales: 8500 },
    { name: "Mark", sales: 6200 },
    { name: "Rico", sales: 9400 },
    { name: "Lara", sales: 7200 },
  ];

  const COLORS = ["#FFD700", "#FFC107", "#FFECB3", "#FFF8E1"];

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_6px_#FFD70040] text-center mb-8">
        Admin Dashboard
      </h2>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 border border-yellow-400/20 rounded-3xl p-5 backdrop-blur-md shadow-[0_0_15px_#FFD70020] flex items-center gap-4 hover:shadow-[0_0_25px_#FFD70040] transition">
          <div className="p-3 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
            <FaBoxOpen size={28} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">Top Products</h3>
            <p className="text-sm text-gray-300">Chips, Soda, Rice</p>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 border border-yellow-400/20 rounded-3xl p-5 backdrop-blur-md shadow-[0_0_15px_#FFD70020] flex items-center gap-4 hover:shadow-[0_0_25px_#FFD70040] transition">
          <div className="p-3 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
            <FaExclamationTriangle size={28} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">Low Stock</h3>
            <p className="text-sm text-gray-300">Soap, Eggs, Vinegar</p>
          </div>
        </div>

        {/* Sales Monitor */}
        <div className="bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 border border-yellow-400/20 rounded-3xl p-5 backdrop-blur-md shadow-[0_0_15px_#FFD70020] flex items-center gap-4 hover:shadow-[0_0_25px_#FFD70040] transition">
          <div className="p-3 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
            <FaChartLine size={28} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">Sales Monitor</h3>
            <p className="text-sm text-gray-300">₱107,600 this month</p>
          </div>
        </div>

        {/* Active Staffs */}
        <div className="bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 border border-yellow-400/20 rounded-3xl p-5 backdrop-blur-md shadow-[0_0_15px_#FFD70020] flex items-center gap-4 hover:shadow-[0_0_25px_#FFD70040] transition">
          <div className="p-3 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">
            <FaUsers size={28} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">Active Staffs</h3>
            <p className="text-sm text-gray-300">4 active today</p>
          </div>
        </div>
      </div>

      {/* --- Sales Trend (Large Chart) --- */}
      <div className="bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 backdrop-blur-md border border-yellow-400/20 rounded-3xl p-6 shadow-[0_0_15px_#FFD70020] mb-6">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">Sales Trend</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFD70020" />
            <XAxis dataKey="name" stroke="#FFD70080" />
            <YAxis stroke="#FFD70080" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#FFD700"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#FFD700", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* --- Product + Staff Charts --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Breakdown */}
        <div className="bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 backdrop-blur-md border border-yellow-400/20 rounded-3xl p-6 shadow-[0_0_15px_#FFD70020]">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Product Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={productData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Staff Performance */}
        <div className="bg-gradient-to-br from-yellow-100/10 to-yellow-200/5 backdrop-blur-md border border-yellow-400/20 rounded-3xl p-6 shadow-[0_0_15px_#FFD70020]">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Staff Performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={staffData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFD70020" />
              <XAxis dataKey="name" stroke="#FFD70080" />
              <YAxis stroke="#FFD70080" />
              <Tooltip />
              <Bar dataKey="sales" fill="#FFD700" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
