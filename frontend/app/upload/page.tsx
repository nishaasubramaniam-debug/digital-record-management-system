"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { toast } from "react-toastify";

export default function UploadDocument() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
  if (!title || !category || !file) {
    toast.warning("Please fill all fields and select a file.");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("folder", selectedFolder); // Selected folder
    formData.append("file", file);

    const response = await axios.post(
      "https://drms-backend-7azn.onrender.com/api/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadProgress(percent);
          }
        },
      }
    );

    toast.success(response.data.message);

    setUploadProgress(0);

    setTitle("");
    setCategory("");
    setSelectedFolder("");
    setFile(null);

    const fileInput = document.getElementById(
      "fileInput"
    ) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }

  } catch (error) {
    console.log(error);

    setUploadProgress(0);

    toast.error("Upload failed.");

  } finally {
    setLoading(false);
  }
};
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
  }
};
useEffect(() => {
  fetchFolders();
}, []);
  
  return (
    <ProtectedRoute>

      <div className="min-h-screen bg-gray-900">

        <Navbar />

        <div className="flex justify-center items-center py-14 px-4">

          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-10">

            <div className="text-center mb-8">

              <h1 className="text-4xl font-bold text-blue-400">
                📤 Upload Document
              </h1>

              <p className="text-gray-400 mt-2">
                Securely upload and manage your documents.
              </p>

            </div>

            <div className="space-y-5">

              <div>

                <label className="block text-gray-300 mb-2 font-semibold">
                  Document Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-gray-300 mb-2 font-semibold">
  Category
</label>

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500"
>
  <option value="">Select Category</option>
  <option value="Education">Education</option>
  <option value="Personal">Personal</option>
  <option value="Resume">Resume</option>
  <option value="Certificate">Certificate</option>
  <option value="Others">Others</option>
</select>

              </div>
              <div>
  <label className="block text-gray-300 mb-2 font-semibold">
    Folder
  </label>

  <select
    value={selectedFolder}
    onChange={(e) => setSelectedFolder(e.target.value)}
    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3"
  >
    <option value="">No Folder</option>

    {folders.map((folder) => (
      <option key={folder._id} value={folder._id}>
        {folder.name}
      </option>
    ))}
  </select>
</div>

              <div>
  <label className="block text-gray-300 mb-2 font-semibold">
    Select File
  </label>

  <div
    onDragOver={(e) => {
      e.preventDefault();
      setDragActive(true);
    }}
    onDragLeave={() => setDragActive(false)}
    onDrop={(e) => {
      e.preventDefault();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0]);
      }
    }}
    className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
      dragActive
        ? "border-blue-500 bg-blue-900/20"
        : "border-gray-600 bg-gray-700"
    }`}
  >
    <p className="text-4xl mb-3">📂</p>

    <p className="text-white font-semibold">
      Drag & Drop your file here
    </p>

    <p className="text-gray-400 my-3">or</p>

    <input
      id="fileInput"
      type="file"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      className="hidden"
    />

    <label
      htmlFor="fileInput"
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg cursor-pointer"
    >
      📁 Choose File
    </label>

    {file && (
  <div className="mt-4 text-green-400">
    <p className="font-semibold">✅ {file.name}</p>
    <p className="text-sm text-gray-300">
      {(file.size / 1024).toFixed(2)} KB
    </p>
  </div>
)}
  </div>
</div>

              <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Uploading..." : "📤 Upload Document"}
              </button>

              {loading && (
  <div className="mt-6">
    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
      <div
        className="bg-blue-500 h-4 transition-all duration-300"
        style={{ width: `${uploadProgress}%` }}
      ></div>
    </div>

    <p className="text-center text-blue-400 mt-2 font-semibold">
      Uploading... {uploadProgress}%
    </p>
  </div>
)}

            </div>

          </div>

        </div>

      </div>

    </ProtectedRoute>
  );
}