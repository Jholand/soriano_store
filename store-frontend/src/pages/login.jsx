import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaKey } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        toast.success(`Welcome, ${result.user.name}!`);
        
        // Navigate based on role
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (result.user.role === "staff") {
          navigate("/pos");
        } else {
          navigate("/");
        }
      } else {
        toast.error(result.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-yellow-50/30"></div>
      
      {/* Floating orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-yellow-100/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-yellow-200/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex flex-col md:flex-row overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-xl w-[90%] max-w-4xl">
        
        {/* Left Side - Branding */}
        <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-yellow-200 via-yellow-100 to-amber-100 border-b md:border-b-0 md:border-r border-yellow-300 md:w-1/2">
          <div className="mb-6 p-8 bg-gradient-to-br from-yellow-300 to-yellow-200 rounded-full border-2 border-yellow-400 shadow-xl shadow-yellow-300/60">
            <FaKey className="text-yellow-700 text-6xl rotate-90" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-3 text-center">
            RaiLyn<span className="text-yellow-600">'s</span>
          </h1>
          <h2 className="text-3xl font-bold text-yellow-600 mb-4">Store</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full mb-4"></div>
          <p className="text-gray-800 text-center text-sm max-w-xs">
            Streamline your business operations with powerful management tools
          </p>
        </div>

        {/* Right Side - Login Form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center p-12 md:w-1/2 space-y-6"
        >
          <div className="mb-4">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h3>
            <p className="text-gray-600 text-sm">Sign in to continue to your account</p>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold tracking-wide shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/40 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Login"}
          </button>

          <p className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
            © 2025 RaiLyn's Store. All rights reserved.
          </p>
        </form>
      </div>
    </div>
  );
}
