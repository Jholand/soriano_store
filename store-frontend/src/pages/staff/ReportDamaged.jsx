import { useState, useEffect } from "react";
import { FaPlus, FaExclamationTriangle, FaBox } from "react-icons/fa";
import axios from "../../utils/axios";
import { toast } from "../../components/Toast";

export default function ReportDamaged() {
  const [products, setProducts] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    reason: "damaged",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, reportsRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/damaged-items')
      ]);
      setProducts(productsRes.data);
      setMyReports(reportsRes.data.data || reportsRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product_id || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axios.post('/api/damaged-items', formData);
      toast.success("Damaged item reported successfully!");
      resetForm();
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report damaged item');
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: "",
      quantity: "",
      reason: "damaged",
      notes: "",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 uppercase font-semibold">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 uppercase font-semibold">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 uppercase font-semibold">Rejected</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-8 bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-white text-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            Report Damaged/Expired Items
          </h2>
          <p className="text-gray-600 text-sm">Report and track damaged or expired inventory</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg shadow-yellow-400/20"
        >
          <FaPlus /> Report Item
        </button>
      </div>

      {/* My Reports */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">My Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Product</th>
                <th className="py-3 px-4 text-center text-gray-600 font-medium">Quantity</th>
                <th className="py-3 px-4 text-center text-gray-600 font-medium">Reason</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Notes</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Reported</th>
                <th className="py-3 px-4 text-center text-gray-600 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Review</th>
              </tr>
            </thead>
            <tbody>
              {myReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-600">
                    No reports yet. Click "Report Item" to start.
                  </td>
                </tr>
              ) : (
                myReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{report.product?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-600">SKU: {report.product?.sku || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-red-400">{report.quantity}</span>
                    </td>
                    <td className="py-3 px-4 text-center capitalize">
                      <span className={`px-2 py-1 rounded text-xs uppercase font-semibold ${
                        report.reason === 'expired' ? 'bg-red-500/20 text-red-400' :
                        report.reason === 'damaged' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {report.reason}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-gray-700">{report.notes || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">{new Date(report.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-600">{new Date(report.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="py-3 px-4">
                      {report.reviewed_at ? (
                        <div className="text-sm">
                          <div className="text-gray-900">By: {report.reviewer?.name || 'Admin'}</div>
                          <div className="text-xs text-gray-600">{report.review_notes}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Pending review</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-yellow-400/30 rounded-2xl w-full max-w-md shadow-2xl shadow-yellow-400/10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Report Damaged/Expired Item</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Product <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                  required
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 text-sm"
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Quantity <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                  min="1"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Reason <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 text-sm"
                >
                  <option value="damaged">Damaged</option>
                  <option value="expired">Expired</option>
                  <option value="lost">Lost</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Notes
                </label>
                <textarea
                  placeholder="Add any additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 resize-none text-sm"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-gray-700 text-sm">
                  <strong className="text-gray-900">Note:</strong> This report will be sent to the admin for approval. Stock will only be adjusted after approval.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg shadow-yellow-400/20"
                >
                  Submit Report
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
