import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  FaCashRegister,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaKey,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";

const StaffSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const links = [
    { name: "POS", icon: <FaCashRegister />, path: "/pos" },
    { name: "Report Damaged", icon: <FaExclamationTriangle />, path: "/staff/report-damaged" },
    { name: "My Reports", icon: <FaClipboardList />, path: "/staff/reports" },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <aside
      className={`h-screen sticky top-0 p-5 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col border-r border-gray-200 bg-white shadow-lg overflow-y-auto scrollbar-hide`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* Header / Store Name */}
      <div
        className={`flex ${
          isOpen ? "items-center justify-between" : "flex-col items-center gap-3"
        } mb-10 transition-all duration-300`}
      >
        <div
          className={`flex flex-col items-center ${
            isOpen ? "gap-2" : "gap-1"
          } transition-all duration-300 text-center`}
        >
          <FaKey
            className="text-yellow-500"
            size={isOpen ? 28 : 24}
          />
          {isOpen && (
            <div className="relative flex flex-col items-center">
              <div className="px-5 py-2 border border-yellow-400 rounded-full bg-yellow-50">
                <h1
                  className="text-xl font-semibold text-yellow-500"
                  style={{ fontFamily: "Cinzel, serif", letterSpacing: "1px" }}
                >
                  RaiLyn's Store
                </h1>
              </div>
              <div className="h-[1px] w-10 bg-yellow-400 mt-2 rounded-full" />
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-gray-600 hover:text-yellow-500 bg-gray-100 hover:bg-yellow-50 p-2 rounded-full transition-all hover:scale-110 ${
            isOpen ? "" : "mt-2"
          }`}
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-3 flex-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-400 shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-yellow-700 hover:border hover:border-yellow-200"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {isOpen && <span>{link.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Section */}
      <div className="mt-8 space-y-4">
        <div
          className={`flex items-center bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-3 transition-all duration-300 ${
            isOpen ? "gap-3" : "flex-col justify-center"
          }`}
        >
          <FaUserCircle className="text-yellow-500 text-3xl" />
          {isOpen && (
            <div>
              <p className="text-sm font-semibold text-gray-900">Staff</p>
              <p className="text-xs text-gray-600">Sales Person</p>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 text-yellow-700 hover:text-yellow-800 hover:shadow-md"
        >
          <FaSignOutAlt className="text-lg" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>

      {isOpen && (
        <div className="mt-auto pt-6 text-center text-[11px] text-gray-500 font-light tracking-wide">
          <p>© 2025 RaiLyn's Store</p>
        </div>
      )}
    </aside>
  );
};

export default StaffSidebar;
