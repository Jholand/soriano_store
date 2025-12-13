import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar.jsx";
import StaffSidebar from "./components/StaffSidebar.jsx";
import Toast from "./components/Toast.jsx";

import Login from "./pages/login.jsx";
import POS from "./pages/staff/POS.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Products from "./pages/admin/Products.jsx";
import Category from "./pages/admin/Category.jsx";
import SalesMonitor from "./pages/admin/SalesMonitor.jsx";
import ManageStaff from "./pages/admin/ManageStaff.jsx";
import Settings from "./pages/admin/Settings.jsx";
import ActivityLogs from "./pages/admin/ActivityLogs.jsx";
import DamagedItems from "./pages/admin/DamagedItems.jsx";
import DiscountRules from "./pages/admin/DiscountRules.jsx";

// Staff pages
import ReportDamaged from "./pages/staff/ReportDamaged.jsx";
import StaffReports from "./pages/staff/StaffReports.jsx";

function AdminWrapper({ children }) {
  return (
    <div className="flex flex-row h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function StaffWrapper({ children }) {
  return (
    <div className="flex flex-row h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Staff Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Staff pages */}
        <Route path="/pos" element={
          <StaffWrapper>
            <POS />
          </StaffWrapper>
        } />

        {/* Admin pages */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminWrapper>
              <AdminDashboard />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminWrapper>
              <Products />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/category"
          element={
            <AdminWrapper>
              <Category />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/pos"
          element={
            <AdminWrapper>
              <POS />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/sales"
          element={
            <AdminWrapper>
              <SalesMonitor />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <AdminWrapper>
              <ManageStaff />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminWrapper>
              <Settings />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/activity-logs"
          element={
            <AdminWrapper>
              <ActivityLogs />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/damaged-items"
          element={
            <AdminWrapper>
              <DamagedItems />
            </AdminWrapper>
          }
        />

        <Route
          path="/admin/discounts"
          element={
            <AdminWrapper>
              <DiscountRules />
            </AdminWrapper>
          }
        />

        <Route
          path="/staff/report-damaged"
          element={
            <StaffWrapper>
              <ReportDamaged />
            </StaffWrapper>
          }
        />

        <Route
          path="/staff/reports"
          element={
            <StaffWrapper>
              <StaffReports />
            </StaffWrapper>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          },
        }}
      />
    </Router>
  );
}

export default App;
