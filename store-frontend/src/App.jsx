import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/login.jsx";
import POS from "./pages/staff/POS.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Products from "./pages/admin/Products.jsx";
import SalesMonitor from "./pages/admin/SalesMonitor.jsx";
import ManageStaff from "./pages/admin/ManageStaff.jsx";
import Settings from "./pages/admin/Settings.jsx";


function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <section id="home" className="min-h-screen flex items-center justify-center">
          <Home />
        </section>
        <section id="about" className="min-h-screen flex items-center justify-center bg-black/80 backdrop-blur-lg border-t border-green-600/20">
          <About />
        </section>
        <section id="contact" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black border-t border-green-500/20">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function AdminWrapper({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
}



function App() {
  return (
    <Router>
      <Routes>
        {/* Landing pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Staff pages */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute role="staff">
              <POS />
            </ProtectedRoute>
          }
        />

        {/* Admin pages */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminWrapper>
                <AdminDashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="admin">
              <AdminWrapper>
                <Products />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <ProtectedRoute role="admin">
              <AdminWrapper>
                <SalesMonitor />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute role="admin">
              <AdminWrapper>
                <ManageStaff />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute role="admin">
              <AdminWrapper>
                <Settings />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />


        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
