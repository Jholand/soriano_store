import { useState, useEffect } from "react";
import { FaSearch, FaPrint, FaCalendarAlt } from "react-icons/fa";
import axios from "../../utils/axios";
import Pagination from "../../components/Pagination";
import { toast } from "react-hot-toast";

export default function SalesMonitor() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.payment_method?.toLowerCase().includes(searchQuery.toLowerCase());

    const orderDate = new Date(order.created_at);
    const matchesStartDate = !startDate || orderDate >= new Date(startDate);
    const matchesEndDate = !endDate || orderDate <= new Date(endDate + "T23:59:59");

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Calculate totals
  const totalSales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
  const totalOrders = filteredOrders.length;

  // Print function
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            .summary { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #FFD700; color: #000; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Sales Report</h1>
          <div class="summary">
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Orders:</strong> ${totalOrders}</p>
            <p><strong>Total Sales:</strong> ₱${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            ${startDate ? `<p><strong>From:</strong> ${startDate}</p>` : ''}
            ${endDate ? `<p><strong>To:</strong> ${endDate}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.customer_name || 'N/A'}</td>
                  <td>
                    ${order.items?.map(item => 
                      `${item.product?.name} (${item.quantity}x)`
                    ).join(', ') || 'N/A'}
                  </td>
                  <td>₱${parseFloat(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${order.payment_method?.toUpperCase() || 'N/A'}</td>
                  <td>${order.payment_status || 'N/A'}</td>
                  <td>${new Date(order.created_at).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated from Soriano Store Sales Monitor</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  return (
    <div className="min-h-screen p-6 md:p-8 bg-white text-gray-900">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Sales Monitor
        </h2>
        <p className="text-gray-700 text-sm">Track sales transactions and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-700 text-sm uppercase tracking-wide mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-700 text-sm uppercase tracking-wide mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-green-500">₱{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by customer, reference, or payment method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
          />
        </div>

        {/* Date Filters */}
        <div className="flex gap-2">
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white border border-gray-200 text-gray-900 pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 text-sm"
              placeholder="Start Date"
            />
          </div>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white border border-gray-200 text-gray-900 pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 text-sm"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap font-medium text-sm shadow-lg"
        >
          <FaPrint /> Print Report
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200">
              <tr className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 text-left font-medium">Order ID</th>
                <th className="py-3 px-4 text-left font-medium">Customer</th>
                <th className="py-3 px-4 text-left font-medium">Items</th>
                <th className="py-3 px-4 text-right font-medium">Total Amount</th>
                <th className="py-3 px-4 text-center font-medium">Payment</th>
                <th className="py-3 px-4 text-center font-medium">Reference</th>
                <th className="py-3 px-4 text-center font-medium">Status</th>
                <th className="py-3 px-4 text-center font-medium">Date</th>
              </tr>
            </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-700">Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : currentOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-600 italic text-sm">
                  {filteredOrders.length === 0 && orders.length > 0
                    ? `No orders found matching "${searchQuery}"`
                    : "No orders available"}
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-yellow-50 transition-all"
                >
                  <td className="py-3 px-4 text-yellow-500 font-bold text-sm">#{order.id}</td>
                  <td className="py-3 px-4 text-gray-900 text-sm">{order.customer_name || 'Walk-in'}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="text-gray-700 text-sm">
                          {item.product?.name} <span className="text-gray-600">(×{item.quantity})</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-green-600 font-bold text-sm">
                    ₱{parseFloat(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.payment_method === 'cash' ? 'bg-green-500/20 text-green-600' :
                      order.payment_method === 'gcash' ? 'bg-blue-500/20 text-blue-600' :
                      'bg-purple-500/20 text-purple-600'
                    }`}>
                      {order.payment_method?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 text-sm">
                    {order.reference_number || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.payment_status === 'paid' ? 'bg-green-500/20 text-green-600' :
                      'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {order.payment_status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                    <br />
                    <span className="text-xs text-gray-600">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredOrders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredOrders.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
