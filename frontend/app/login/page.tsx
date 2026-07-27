"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://drms-backend-7azn.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      // Store JWT Token
      localStorage.setItem("token", response.data.token);

      // Store User Details
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Login successful!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-400">
            🔐 Login
          </h1>

          <p className="text-gray-400 mt-2">
            Welcome back to Digital Record Management System
          </p>

        </div>

        <div className="mb-5">

          <label className="block text-gray-300 mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
          />

        </div>

        <div className="mb-6">

          <label className="block text-gray-300 mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
          />

        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "🔑 Login"}
        </button>

        <div className="mt-8 text-center">

          <p className="text-gray-400">
            Don't have an account?
          </p>

          <button
            onClick={() => router.push("/register")}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            📝 Create Account
          </button>

        </div>

      </div>

    </div>
  );
}