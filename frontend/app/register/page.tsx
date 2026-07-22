"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.warning("Please fill all the fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      toast.success(response.data.message);

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-green-400">
            📝 Create Account
          </h1>

          <p className="text-gray-400 mt-2">
            Register to access the Digital Record Management System
          </p>

        </div>

        <div className="mb-5">

          <label className="block text-gray-300 mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
          />

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
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
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
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-green-500"
          />

        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating Account..." : "✅ Register"}
        </button>

        <div className="mt-8 text-center">

          <p className="text-gray-400">
            Already have an account?
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            🔐 Login
          </button>

        </div>

      </div>

    </div>
  );
}