import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaExclamationTriangle, FaClock } from "react-icons/fa";
import axios from "../../utils/axios";
import { toast } from "../../components/Toast";

export default function DamagedItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewAction, setReviewAction] = useState("");

  useEffect(() => {
    fetchDamagedItems();
  }, [statusFilter]);

  const fetchDamagedItems = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await axios.get(`/api/damaged-items${params}`);
      setItems(response.data.data || response.data);
    } catch (err) {
      toast.error('Failed to fetch damaged items');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (item, action) => {
    setSelectedItem(item);
    setReviewAction(action);
    setReviewNotes("");
    setShowReviewModal(true);
  };

  const handleReview = async () => {
    if (!reviewNotes.trim()) {
      toast.error('Please provide review notes');
      return;
    }

    try {
      const endpoint = reviewAction === 'approve' 
        ? `/api/damaged-items/${selectedItem.id}/approve`
        : `/api/damaged-items/${selectedItem.id}/reject`;

      await axios.put(endpoint, { review_notes: reviewNotes });
      
      toast.success(`Item ${reviewAction}ed successfully`);
      setShowReviewModal(false);
      setSelectedItem(null);
      setReviewNotes("");
      fetchDamagedItems();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${reviewAction} item`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-400/40 uppercase font-semibold">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-400/40 uppercase font-semibold">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 border border-red-400/40 uppercase font-semibold">Rejected</span>;
      default:
        return null;
    }
  };

  const getReasonBadge = (reason) => {
    const colors = {
      damaged: 'bg-orange-500/20 text-orange-400 border-orange-400/40',
      expired: 'bg-red-500/20 text-red-400 border-red-400/40',
      lost: 'bg-purple-500/20 text-purple-400 border-purple-400/40',
      other: 'bg-gray-500/20 text-gray-400 border-gray-400/40',
    };
    return <span className={`px-2 py-1 rounded text-xs border uppercase font-semibold ${colors[reason] || colors.other}`}>{reason}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-yellow-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-yellow-300">Loading damaged items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-white text-gray-900">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          Damaged Items
        </h2>
        <p className="text-gray-600 text-sm">Review and approve damage reports</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-3">
        {['pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 capitalize font-semibold text-sm ${
              statusFilter === status
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-400/30'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-yellow-400 hover:border-yellow-400/20'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Items Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200">
              <tr className="text-sm text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-medium">Product</th>
                <th className="py-3 px-4 text-center font-medium">Quantity</th>
                <th className="py-3 px-4 text-center font-medium">Reason</th>
                <th className="py-3 px-4 text-left font-medium">Reported By</th>
                <th className="py-3 px-4 text-left font-medium">Notes</th>
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-center font-medium">Status</th>
                {statusFilter === 'pending' && (
                  <th className="py-3 px-4 text-center font-medium w-32">Actions</th>
                )}
              </tr>
            </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={statusFilter === 'pending' ? 8 : 7} className="py-8 text-center text-gray-600 text-sm italic">
                  No {statusFilter} items found
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-700/30 transition-all">
                  <td className="py-3 px-4">
                    <div className="text-gray-900 font-semibold text-sm">{item.product?.name || 'Unknown Product'}</div>
                    <div className="text-xs text-gray-500">SKU: {item.product?.sku || 'N/A'}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-red-400 text-sm">{item.quantity}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getReasonBadge(item.reason)}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm">{item.reporter?.name || 'Unknown'}</td>
                  <td className="py-3 px-4 max-w-xs truncate text-gray-400 text-sm">{item.notes || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-700">{new Date(item.created_at).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(item.created_at).toLocaleTimeString()}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  {statusFilter === 'pending' && (
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openReviewModal(item, 'approve')}
                          className="text-gray-400 hover:text-green-400 transition-colors p-2 text-lg"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => openReviewModal(item, 'reject')}
                          className="text-gray-400 hover:text-red-400 transition-colors p-2 text-lg"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-400/10 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <FaExclamationTriangle className="text-3xl text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-900">
                {reviewAction === 'approve' ? 'Approve' : 'Reject'} Item
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">Product</label>
                <p className="text-gray-900 text-sm font-medium">{selectedItem.product?.name}</p>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">Quantity</label>
                <p className="text-gray-900 text-sm font-medium">{selectedItem.quantity} units</p>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">Reason</label>
                <p className="text-gray-900 text-sm font-medium capitalize">{selectedItem.reason}</p>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">Reporter's Notes</label>
                <p className="text-gray-900 text-sm font-medium">{selectedItem.notes || 'No notes provided'}</p>
              </div>

              {reviewAction === 'approve' && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                  <p className="text-yellow-700 text-sm font-medium">
                    <strong>Note:</strong> Approving this will deduct {selectedItem.quantity} units from the product stock.
                  </p>
                </div>
              )}

              <div>
                <label className="text-gray-700 text-sm font-semibold mb-2 block">
                  Review Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows="3"
                  placeholder="Enter your review notes..."
                  className="w-full bg-white border border-gray-200 text-gray-900 px-4 py-2.5 rounded-lg focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 placeholder-gray-500 resize-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReview}
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm shadow-lg ${
                  reviewAction === 'approve'
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:shadow-green-500/20'
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:shadow-red-500/20'
                }`}
              >
                {reviewAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
