"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    // Remove stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    // Redirect to login
    router.push("/login");
  };

  return (
    <nav className="bg-gray-950 border-b border-gray-700 shadow-lg">

      <div className="max-w-7xl mx-auto flex justify-between items-center p-5">

        <h1 className="text-3xl font-bold text-blue-400">
          📂 DRMS
        </h1>

        <div className="flex gap-6 items-center">

          <Link
            href="/dashboard"
            className="text-white hover:text-blue-400 transition font-medium"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/upload"
            className="text-white hover:text-green-400 transition font-medium"
          >
            📤 Upload
          </Link>

          <Link
            href="/documents"
            className="text-white hover:text-yellow-400 transition font-medium"
          >
            📁 Documents
          </Link>

          <Link
            href="/profile"
            className="text-white hover:text-purple-400 transition font-medium"
          >
            👤 Profile
          </Link>

          <button
            onClick={handleLogout}
            className="text-white hover:text-red-400 transition font-medium"
          >
            🚪 Logout
          </button>

        </div>

      </div>

    </nav>
  );
}