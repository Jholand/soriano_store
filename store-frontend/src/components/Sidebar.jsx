import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaChartLine,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaKey,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const links = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Products", icon: <FaBoxOpen />, path: "/admin/products" },
    { name: "Sales Monitor", icon: <FaChartLine />, path: "/admin/sales" },
    { name: "Manage Staff", icon: <FaUsers />, path: "/admin/staff" },
    { name: "Settings", icon: <FaKey />, path: "/admin/settings" },
  ];

  return (
    <aside
      className={`min-h-screen p-5 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col border-r border-yellow-400/20 bg-gradient-to-b from-black via-gray-950 to-black/90 backdrop-blur-2xl shadow-[0_0_20px_#FFD70020] overflow-hidden`}
    >
      {/* Header / Store Name */}
      <div
        className={`flex ${
          isOpen ? "items-center justify-between" : "flex-col items-center gap-3"
        } mb-10 transition-all duration-300`}
      >
        {/* Logo Section — Luxury Emblem Style */}
        <div
          className={`flex flex-col items-center ${
            isOpen ? "gap-2" : "gap-1"
          } transition-all duration-300 text-center`}
        >
          <FaKey
            className="text-yellow-500 rotate-90 drop-shadow-[0_0_3px_#FFD70060]"
            size={isOpen ? 28 : 24}
          />
          {isOpen && (
            <div className="relative flex flex-col items-center">
              <div className="px-5 py-2 border border-yellow-500/30 rounded-full bg-gradient-to-r from-yellow-500/10 to-transparent shadow-[0_0_15px_#FFD70020] backdrop-blur-sm">
                <h1
                  className="text-xl font-semibold text-yellow-400 drop-shadow-[0_0_5px_#FFD70040]"
                  style={{ fontFamily: "Cinzel, serif", letterSpacing: "1px" }}
                >
                  RaiLyn’s Store
                </h1>
              </div>
              <div className="h-[1px] w-10 bg-yellow-500/40 mt-2 rounded-full" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-yellow-400 hover:text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 p-2 rounded-full transition-transform hover:scale-110 ${
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500/30 to-yellow-400/20 text-yellow-300 border border-yellow-400/30 shadow-[0_0_10px_#FFD70030]"
                    : "text-yellow-200 hover:bg-yellow-400/10 hover:text-yellow-300"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {isOpen && <span>{link.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Admin Profile + Logout (Bottom Section) */}
      <div className="mt-8 space-y-4">
        <div
          className={`flex items-center bg-yellow-400/5 border border-yellow-500/20 rounded-xl px-3 py-2 transition-all duration-300 ${
            isOpen ? "gap-3" : "flex-col justify-center"
          }`}
        >
          <FaUserCircle className="text-yellow-400 text-3xl drop-shadow-[0_0_5px_#FFD70040]" />
          {isOpen && (
            <div>
              <p className="text-sm font-medium text-yellow-200">Admin</p>
              <p className="text-xs text-yellow-500/70">Store Manager</p>
            </div>
          )}
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all border border-yellow-500/20 hover:bg-yellow-400/10 text-yellow-300 hover:text-yellow-200"
        >
          <FaSignOutAlt className="text-lg" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>

      {isOpen && (
        <div className="mt-auto pt-6 text-center text-[11px] text-yellow-500/60 font-light tracking-wide">
          <p>© 2025 RaiLyn Store</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
