"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">

        <h1 className="text-5xl md:text-6xl font-bold">
          Digital Record
          <span className="text-yellow-400"> Management System</span>
        </h1>

        <p className="mt-6 text-xl max-w-3xl text-gray-200">
          Securely store, organize, search, share and manage all your
          important digital documents from one centralized platform.
        </p>

        <div className="mt-10 flex gap-5">

          <button
            onClick={() => router.push("/register")}
            className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/login")}
            className="border border-white px-8 py-4 rounded-xl hover:bg-white hover:text-black transition"
          >
            Login
          </button>

        </div>

      </section>

      {/* Features */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <h2 className="text-4xl font-bold text-center mb-14">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-2xl font-bold">Document Storage</h3>
            <p className="mt-3 text-gray-200">
              Upload and securely store all your documents in one place.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-4">📁</div>
            <h3 className="text-2xl font-bold">Folder Management</h3>
            <p className="mt-3 text-gray-200">
              Organize documents into folders for better productivity.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold">Favorites</h3>
            <p className="mt-3 text-gray-200">
              Quickly access your most important documents anytime.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold">Smart Search</h3>
            <p className="mt-3 text-gray-200">
              Find files instantly using title and category.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-2xl font-bold">Recycle Bin</h3>
            <p className="mt-3 text-gray-200">
              Restore deleted documents whenever needed.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-2xl font-bold">Share Documents</h3>
            <p className="mt-3 text-gray-200">
              Generate secure links to share files with others.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="text-center py-8 border-t border-white/20 text-gray-300">

        © 2026 Digital Record Management System | Developed by Nishaa

      </footer>

    </main>
  );
}