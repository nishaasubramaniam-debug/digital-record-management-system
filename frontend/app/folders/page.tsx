"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { toast } from "react-toastify";

export default function FolderPage() {
const [folders, setFolders] = useState<any[]>([]);
const [folderName, setFolderName] = useState("");

// ======================
// Fetch All Folders
// ======================
const fetchFolders = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://drms-backend-7azn.onrender.com/api/folders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setFolders(response.data);

  } catch (error) {
    console.log(error);
    toast.error("Failed to load folders.");
  }
};

// ======================
// Load folders when page opens
// ======================
useEffect(() => {
  fetchFolders();
}, []);

// ======================
// Create Folder
// ======================
const createFolder = async () => {
  if (!folderName.trim()) {
    toast.warning("Please enter a folder name.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://drms-backend-7azn.onrender.com/api/folders",
      {
        name: folderName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchFolders();

    setFolderName("");

    toast.success("Folder created successfully!");

  } catch (error) {
    console.log(error);
    toast.error("Failed to create folder.");
  }
};

    const deleteFolder = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `https://drms-backend-7azn.onrender.com/api/folders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Folder deleted successfully!");

    fetchFolders();

  } catch (error) {
    console.log(error);
    toast.error("Failed to delete folder.");
  }
};

    const renameFolder = async (id: string, currentName: string) => {
  const newName = prompt("Enter new folder name:", currentName);

  if (!newName || newName.trim() === "") return;

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://drms-backend-7azn.onrender.com/api/folders/${id}`,
      {
        name: newName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Folder renamed successfully!");

    fetchFolders();

  } catch (error) {
    console.log(error);
    toast.error("Failed to rename folder.");
  }
};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Navbar />

        <div className="max-w-4xl mx-auto p-8">

          <h1 className="text-4xl font-bold text-white mb-8">
            📁 Folder Management
          </h1>

          <div className="bg-gray-800 rounded-xl p-6 mb-8">

  <input
    type="text"
    placeholder="Enter Folder Name"
    value={folderName}
    onChange={(e) => setFolderName(e.target.value)}
    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 mb-4"
  />

  <button
    onClick={createFolder}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
  >
    ➕ Create Folder
  </button>

</div>
    <div className="bg-gray-800 rounded-xl p-6">

  <h2 className="text-2xl font-bold text-white mb-6">
    📂 My Folders
  </h2>

  {folders.length === 0 ? (
    <p className="text-gray-400">
      No folders created yet.
    </p>
  ) : (
    <div className="space-y-4">
      {folders.map((folder) => (
        <div
          key={folder._id}
          className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
        >
          <div>
            <h3 className="text-white font-bold">
              📁 {folder.name}
            </h3>

            <p className="text-gray-400 text-sm">
              {new Date(folder.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div className="space-x-3">
            <button
  onClick={() => renameFolder(folder._id, folder.name)}
  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
>
  ✏️
</button>

            <button
            onClick={() => deleteFolder(folder._id)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
            🗑️
            </button>
          </div>

        </div>
      ))}
    </div>
  )}

</div>

        </div>
      </div>
    </ProtectedRoute>
  );
}