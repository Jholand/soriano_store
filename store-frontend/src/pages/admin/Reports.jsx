import { useState, useEffect } from "react";
import { FaChartLine, FaBoxOpen, FaDollarSign, FaExclamationTriangle, FaCalendar } from "react-icons/fa";
import axios from "../../utils/axios";
import { toast } from "../../components/Toast";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("sales");
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("daily");
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });

  // Reports data
  const [salesReport, setSalesReport] = useState(null);
  const [topSelling, setTopSelling] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [revenueExpense, setRevenueExpense] = useState(null);

  useEffect(() => {
    if (activeTab === "sales") fetchSalesReport();
    else if (activeTab === "topSelling") fetchTopSelling();
    else if (activeTab === "lowStock") fetchLowStock();
    else if (activeTab === "inventory") fetchInventoryReport();
    else if (activeTab === "revenue") fetchRevenueExpense();
  }, [activeTab, period, dateRange]);

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ period });
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);

      const response = await axios.get(`/api/reports/sales?${params.toString()}`);
      setSalesReport(response.data);
    } catch (err) {
      toast.error('Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSelling = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: 10 });
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);

      const response = await axios.get(`/api/reports/top-selling?${params.toString()}`);
      setTopSelling(response.data);
    } catch (err) {
      toast.error('Failed to fetch top selling products');
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports/low-stock');
      setLowStock(response.data);
    } catch (err) {
      toast.error('Failed to fetch low stock report');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports/inventory');
      setInventoryReport(response.data);
    } catch (err) {
      toast.error('Failed to fetch inventory report');
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueExpense = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);

      const response = await axios.get(`/api/reports/revenue-expense?${params.toString()}`);
      setRevenueExpense(response.data);
    } catch (err) {
      toast.error('Failed to fetch revenue/expense report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-white text-gray-900">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          Reports & Analytics
        </h2>
        <p className="text-gray-600 text-sm">Comprehensive analytics and reporting</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { id: 'sales', label: 'Sales Report', icon: <FaChartLine /> },
          { id: 'topSelling', label: 'Top Selling', icon: <FaDollarSign /> },
          { id: 'lowStock', label: 'Low Stock', icon: <FaExclamationTriangle /> },
          { id: 'inventory', label: 'Inventory', icon: <FaBoxOpen /> },
          { id: 'revenue', label: 'Revenue/Expense', icon: <FaDollarSign /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all text-sm ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-400/30 font-semibold"
                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-yellow-400 border border-gray-200 hover:border-yellow-400/20"
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      {(activeTab === 'sales' || activeTab === 'topSelling' || activeTab === 'revenue') && (
        <div className="flex flex-wrap gap-3 mb-6">
          {activeTab === 'sales' && (
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:border-yellow-400/50 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}
          <input
            type="date"
            value={dateRange.start_date}
            onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-yellow-400/50 text-sm"
          />
          <input
            type="date"
            value={dateRange.end_date}
            onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-yellow-400/50 text-sm"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      ) : (
        <>
          {/* Sales Report */}
          {activeTab === 'sales' && salesReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                  <div className="text-gray-600 text-sm mb-2">Total Sales</div>
                  <div className="text-3xl font-bold text-yellow-400">₱{parseFloat(salesReport.total_sales || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                  <div className="text-gray-600 text-sm mb-2">Transactions</div>
                  <div className="text-3xl font-bold text-gray-900">{salesReport.total_transactions || 0}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                  <div className="text-gray-600 text-sm mb-2">Avg Sale</div>
                  <div className="text-3xl font-bold text-yellow-400">₱{parseFloat(salesReport.average_sale || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                  <div className="text-gray-600 text-sm mb-2">Total Discount</div>
                  <div className="text-3xl font-bold text-red-400">₱{parseFloat(salesReport.total_discount || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                </div>
              </div>

              {/* Recent Transactions */}
              {salesReport.transactions && salesReport.transactions.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Code</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Staff</th>
                          <th className="py-3 px-4 text-center text-gray-600 font-medium">Items</th>
                          <th className="py-3 px-4 text-right text-gray-600 font-medium">Total</th>
                          <th className="py-3 px-4 text-left text-gray-600 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesReport.transactions.slice(0, 10).map(tx => (
                          <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                            <td className="py-3 px-4 text-gray-700">{tx.transaction_code}</td>
                            <td className="py-3 px-4 text-gray-700">{tx.user?.name || 'N/A'}</td>
                            <td className="py-3 px-4 text-center text-gray-700">{tx.items?.length || 0}</td>
                            <td className="py-3 px-4 text-right text-yellow-400 font-bold">₱{parseFloat(tx.total).toFixed(2)}</td>
                            <td className="py-3 px-4 text-gray-600 text-xs">{new Date(tx.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Top Selling */}
          {activeTab === 'topSelling' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 10 Selling Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-gray-600 font-medium">Rank</th>
                      <th className="py-3 px-4 text-left text-gray-600 font-medium">Product</th>
                      <th className="py-3 px-4 text-center text-gray-600 font-medium">Units Sold</th>
                      <th className="py-3 px-4 text-right text-gray-600 font-medium">Revenue</th>
                      <th className="py-3 px-4 text-center text-gray-600 font-medium">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSelling.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-600">No data available</td>
                      </tr>
                    ) : (
                      topSelling.map((product, index) => (
                        <tr key={product.product_id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="py-3 px-4">
                            <span className={`font-bold ${index < 3 ? 'text-yellow-400 text-lg' : 'text-gray-700'}`}>
                              #{index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{product.product_name}</td>
                          <td className="py-3 px-4 text-center text-blue-400 font-bold">{product.total_quantity}</td>
                          <td className="py-3 px-4 text-right text-yellow-400 font-bold">₱{parseFloat(product.total_revenue).toFixed(2)}</td>
                          <td className="py-3 px-4 text-center text-gray-700">{product.transaction_count}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Low Stock */}
          {activeTab === 'lowStock' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaExclamationTriangle className="text-red-400 text-xl" />
                <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-gray-600 font-medium">Product</th>
                      <th className="py-3 px-4 text-left text-gray-600 font-medium">Category</th>
                      <th className="py-3 px-4 text-center text-gray-600 font-medium">Current Stock</th>
                      <th className="py-3 px-4 text-center text-gray-600 font-medium">Reorder Point</th>
                      <th className="py-3 px-4 text-center text-gray-600 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-green-400">
                          All products are well stocked! 🎉
                        </td>
                      </tr>
                    ) : (
                      lowStock.map((product) => (
                        <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                          <td className="py-3 px-4 text-gray-700">{product.category?.name || 'N/A'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={product.stock === 0 ? 'text-red-400 font-bold' : 'text-yellow-400 font-semibold'}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-700">{product.reorder_point}</td>
                          <td className="py-3 px-4 text-center">
                            {product.stock === 0 ? (
                              <span className="px-3 py-1 rounded-lg text-xs bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-semibold">
                                Out of Stock
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-lg text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase font-semibold">
                                Low Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inventory Report */}
          {activeTab === 'inventory' && inventoryReport && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                <div className="text-gray-600 text-sm mb-2">Total Products</div>
                <div className="text-3xl font-bold text-gray-900">{inventoryReport.total_products}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                <div className="text-gray-600 text-sm mb-2">Stock Value</div>
                <div className="text-2xl font-bold text-yellow-400">₱{parseFloat(inventoryReport.total_stock_value || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                <div className="text-gray-600 text-sm mb-2">Low Stock Items</div>
                <div className="text-3xl font-bold text-yellow-400">{inventoryReport.low_stock_count}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                <div className="text-gray-600 text-sm mb-2">Out of Stock</div>
                <div className="text-3xl font-bold text-red-400">{inventoryReport.out_of_stock_count}</div>
              </div>
            </div>
          )}

          {/* Revenue/Expense */}
          {activeTab === 'revenue' && revenueExpense && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                  <div className="text-gray-600 text-sm mb-2">Total Revenue</div>
                  <div className="text-3xl font-bold text-yellow-400">₱{parseFloat(revenueExpense.total_revenue || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                  <div className="text-gray-600 text-sm mb-2">Gross Revenue</div>
                  <div className="text-3xl font-bold text-gray-900">₱{parseFloat(revenueExpense.gross_revenue || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/10 transition-all">
                  <div className="text-gray-600 text-sm mb-2">Discounts Given</div>
                  <div className="text-3xl font-bold text-red-400">₱{parseFloat(revenueExpense.total_discount_given || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="text-gray-600 text-sm mb-2">Total Transactions</div>
                  <div className="text-3xl font-bold text-gray-900">{revenueExpense.transaction_count}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="text-gray-600 text-sm mb-2">Daily Average</div>
                  <div className="text-3xl font-bold text-yellow-400">₱{parseFloat(revenueExpense.daily_average || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
