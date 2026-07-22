"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <main className="bg-white shadow-lg rounded-xl p-10 text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Digital Record Management System
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Securely store, manage, and access digital records efficiently.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Register
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold">Upload</h2>
            <p className="text-sm text-gray-500">
              Store documents digitally
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold">Manage</h2>
            <p className="text-sm text-gray-500">
              Organize records easily
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold">Secure</h2>
            <p className="text-sm text-gray-500">
              Protected database access
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}