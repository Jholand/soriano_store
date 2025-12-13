import { FaKey, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", href: "#home" },
    { name: "Login", href: "/login" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-yellow-500/30 shadow-[0_0_10px_#FFD70030]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <FaKey className="text-yellow-400 text-3xl rotate-90 drop-shadow-[0_0_4px_#FFD70060]" />
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-yellow-400">RaiLyn’s</span>{" "}
            <span className="text-white">Store</span>
          </h1>
        </div>

        {/* Menu Toggle (Mobile) */}
        <button
          className="md:hidden text-yellow-400 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <ul
          className={`absolute md:static left-0 top-16 md:top-auto w-full md:w-auto bg-black/90 md:bg-transparent border-t md:border-0 border-yellow-400/20 md:flex space-y-4 md:space-y-0 md:space-x-8 text-yellow-200 font-medium text-center transition-all duration-300 ${
            menuOpen ? "block" : "hidden md:flex"
          }`}
        >
          {links.map((link) => (
            <li key={link.name}>
              {link.name === "Login" ? (
                <Link
                  to={link.href}
                  className="block py-2 md:py-0 hover:text-yellow-400 transition-colors duration-300 hover:drop-shadow-[0_0_6px_#FFD700]"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="block py-2 md:py-0 hover:text-yellow-400 transition-colors duration-300 hover:drop-shadow-[0_0_6px_#FFD700]"
                >
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
