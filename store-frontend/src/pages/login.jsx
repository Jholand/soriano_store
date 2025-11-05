import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaKey } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
    } else if (username === "staff" && password === "staff123") {
      localStorage.setItem("role", "staff");
      navigate("/pos");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden">
      {/* Glowing background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-400/10 blur-3xl rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 flex flex-col items-center gap-6 bg-black/60 backdrop-blur-xl border border-yellow-500/20 p-10 rounded-3xl shadow-[0_0_25px_#FFD70020] hover:shadow-[0_0_40px_#FFD70040] transition-all duration-500 w-[90%] max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <FaKey className="text-yellow-400 text-5xl rotate-90 drop-shadow-[0_0_6px_#FFD70080]" />
          <h2 className="text-3xl font-[Cinzel] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-[0_0_6px_#FFD70040]">
            RaiLyn’s Store
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm text-center max-w-xs">
          Sign in to access your{" "}
          <span className="text-yellow-400 font-semibold">exclusive</span> dashboard.
        </p>

        {/* Inputs */}
        <div className="w-full flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-lg bg-black/40 border border-yellow-500/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-black/40 border border-yellow-500/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-semibold tracking-wide shadow-[0_0_10px_#FFD70040] hover:shadow-[0_0_25px_#FFD70060] hover:scale-105 transition-all duration-300"
        >
          Login
        </button>

        {/* Footer text */}
        <p className="text-xs text-gray-500 mt-4">
          © 2025 RaiLyn’s Store. All rights reserved.
        </p>
      </form>

      {/* Decorative border lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
    </div>
  );
}
