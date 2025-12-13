import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaEye, FaUser, FaClock } from "react-icons/fa";
import axios from "../../utils/axios";
import { toast } from "../../components/Toast";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    action: "",
    entity_type: "",
    start_date: "",
    end_date: "",
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.entity_type) params.append('entity_type', filters.entity_type);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (searchQuery) params.append('search', searchQuery);

      const response = await axios.get(`/api/activity-logs?${params.toString()}`);
      setLogs(response.data.data || response.data);
    } catch (err) {
      toast.error('Failed to fetch activity logs');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const viewDetails = async (logId) => {
    try {
      const response = await axios.get(`/api/activity-logs/${logId}`);
      setSelectedLog(response.data);
      setShowDetailModal(true);
    } catch (err) {
      toast.error('Failed to fetch log details');
    }
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'created': return 'bg-green-500/20 text-green-600 border-green-500/40';
      case 'updated': return 'bg-blue-500/20 text-blue-600 border-blue-500/40';
      case 'deleted': return 'bg-red-500/20 text-red-600 border-red-500/40';
      case 'approved': return 'bg-green-500/20 text-green-600 border-green-500/40';
      case 'rejected': return 'bg-red-500/20 text-red-600 border-red-500/40';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/40';
    }
  };

  const filteredLogs = logs.filter(log =>
    log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-yellow-200 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-yellow-300">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-white text-gray-900">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Activity Logs
        </h2>
        <p className="text-gray-700 text-sm">Monitor all staff actions and changes</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-gray-900 text-sm font-semibold mb-2 block uppercase tracking-wide">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
              className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 text-sm"
            >
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-gray-900 text-sm font-semibold mb-2 block uppercase tracking-wide">
              Entity Type
            </label>
            <select
              value={filters.entity_type}
              onChange={(e) => setFilters({...filters, entity_type: e.target.value})}
              className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 text-sm"
            >
              <option value="">All Types</option>
              <option value="Product">Product</option>
              <option value="Category">Category</option>
              <option value="User">User</option>
              <option value="SalesTransaction">Sales Transaction</option>
              <option value="DamagedItem">Damaged Item</option>
              <option value="DiscountRule">Discount Rule</option>
            </select>
          </div>

          <div>
            <label className="text-gray-900 text-sm font-semibold mb-2 block uppercase tracking-wide">
              Start Date
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({...filters, start_date: e.target.value})}
              className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 text-sm"
            />
          </div>

          <div>
            <label className="text-gray-900 text-sm font-semibold mb-2 block uppercase tracking-wide">
              End Date
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({...filters, end_date: e.target.value})}
              className="w-full bg-white border border-gray-300 text-gray-900 font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 text-sm"
            />
          </div>
        </div>

        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search logs by description or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-white border border-gray-200 text-gray-900 font-medium pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400/50 placeholder-gray-500 text-sm"
          />
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200">
              <tr className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4 text-left font-medium">Time</th>
              <th className="py-3 px-4 text-left font-medium">User</th>
              <th className="py-3 px-4 text-center font-medium">Action</th>
              <th className="py-3 px-4 text-left font-medium">Entity</th>
              <th className="py-3 px-4 text-left font-medium">Description</th>
              <th className="py-3 px-4 text-center font-medium w-24">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-600 text-sm italic">
                  No activity logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-200 hover:bg-yellow-50 transition-all">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-900">{new Date(log.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-700">{new Date(log.created_at).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-600" />
                      <span className="text-sm text-gray-900">{log.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${getActionBadgeColor(log.action)} uppercase font-semibold`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-yellow-500 text-sm font-bold">{log.entity_type}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{log.description}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => viewDetails(log.id)}
                      className="text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <FaEye className="inline text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-400/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Activity Log Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">User</label>
                <p className="text-gray-900 text-sm">{selectedLog.user?.name} ({selectedLog.user?.email})</p>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">Action</label>
                <span className={`px-3 py-1 rounded text-sm ${getActionBadgeColor(selectedLog.action)} uppercase font-semibold`}>
                  {selectedLog.action}
                </span>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">Entity</label>
                <p className="text-gray-900 text-sm">{selectedLog.entity_type} (ID: {selectedLog.entity_id || 'N/A'})</p>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">Description</label>
                <p className="text-gray-900 text-sm">{selectedLog.description}</p>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">IP Address</label>
                <p className="text-gray-900 text-sm">{selectedLog.ip_address}</p>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold block mb-1">Time</label>
                <p className="text-gray-900 text-sm">
                  {new Date(selectedLog.created_at).toLocaleString()}
                </p>
              </div>

              {selectedLog.old_values && Object.keys(selectedLog.old_values).length > 0 && (
                <div>
                  <label className="text-gray-700 text-sm font-semibold block mb-2">Previous Values</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                    {Object.entries(selectedLog.old_values).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-3 py-2 border-b border-gray-200 last:border-0">
                        <span className="text-gray-600 font-semibold text-sm capitalize min-w-[120px]">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-900 text-sm font-medium flex-1">
                          {typeof value === 'object' && value !== null 
                            ? JSON.stringify(value) 
                            : String(value || 'N/A')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLog.new_values && Object.keys(selectedLog.new_values).length > 0 && (
                <div>
                  <label className="text-gray-700 text-sm font-semibold block mb-2">Updated Values</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                    {Object.entries(selectedLog.new_values).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-3 py-2 border-b border-gray-200 last:border-0">
                        <span className="text-gray-600 font-semibold text-sm capitalize min-w-[120px]">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-900 text-sm font-medium flex-1">
                          {typeof value === 'object' && value !== null 
                            ? JSON.stringify(value) 
                            : String(value || 'N/A')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shadow-lg shadow-yellow-400/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
