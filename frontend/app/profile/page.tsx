"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [lastLogin, setLastLogin] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const userData = JSON.parse(storedUser);

    setUser(userData);

    setName(userData.name);

    setEmail(userData.email);
  }

  setLastLogin(new Date().toLocaleDateString("en-GB"));
}, []);
const handleUpdate = async () => {
  try {
    const response = await axios.put(
      "http://localhost:5000/api/auth/profile",
      {
        name,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    setUser(response.data.user);

    setIsEditing(false);

    alert("Profile updated successfully!");

  } catch (error) {
    console.log(error);
    alert("Profile update failed");
  }
};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">

        <Navbar />

        <div className="flex justify-center items-center py-12 px-4">

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-lg">

            {/* Profile Header */}

            <div className="flex flex-col items-center">

              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <h1 className="text-4xl font-bold text-white mt-6">
                {user?.name || "User"}
              </h1>

              <p className="text-gray-400 mt-2">
                {user?.email || "No Email"}
              </p>

            </div>

            {/* User Information */}

            <div className="mt-10 space-y-5">

              <div className="bg-gray-700 rounded-xl p-5">

                <p className="text-gray-400 text-sm">
                  Full Name
                </p>

                <h2 className="text-white text-xl font-semibold mt-1">
                  {user?.name || "Not Available"}
                </h2>

              </div>

              <div className="bg-gray-700 rounded-xl p-5">

                <p className="text-gray-400 text-sm">
                  Email Address
                </p>

                <h2 className="text-white text-xl font-semibold mt-1">
                  {user?.email || "Not Available"}
                </h2>

              </div>

              <div className="bg-gray-700 rounded-xl p-5">

                <p className="text-gray-400 text-sm">
                  Account Status
                </p>

                <h2 className="text-green-400 text-xl font-semibold mt-1">
                  🟢 Active
                </h2>

              </div>

              <div className="bg-gray-700 rounded-xl p-5">

                <p className="text-gray-400 text-sm">
                  Last Login
                </p>

                <h2 className="text-white text-xl font-semibold mt-1">
                  {lastLogin || "Loading..."}
                </h2>

              </div>

            </div>

            {/* Edit Profile Button */}

            <button
              className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition duration-300"
              onClick={() => setIsEditing(true)}
            >
              ✏ Edit Profile
            </button>
            {isEditing && (
  <div className="mt-6 bg-gray-700 rounded-xl p-6">

    <h2 className="text-2xl text-white font-bold mb-4">
      Edit Profile
    </h2>

    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Full Name"
      className="w-full mb-4 bg-gray-800 text-white p-3 rounded-lg"
    />

    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
      className="w-full mb-4 bg-gray-800 text-white p-3 rounded-lg"
    />

    <div className="flex gap-4">

      <button
        onClick={handleUpdate}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
      >
        💾 Save
      </button>

      <button
        onClick={() => setIsEditing(false)}
        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg"
      >
        Cancel
      </button>

    </div>

  </div>
)}

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
  
}