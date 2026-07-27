"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { toast } from "react-toastify";

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "📕";

    case "doc":
    case "docx":
      return "🟦";

    case "xls":
    case "xlsx":
      return "🟩";

    case "ppt":
    case "pptx":
      return "🟧";

    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "🖼️";

    case "txt":
      return "📄";

    case "zip":
    case "rar":
      return "🗜️";

    default:
      return "📁";
  }
}

export default function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [showFavorites, setShowFavorites] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [previewFile, setPreviewFile] = useState("");
  const [previewType, setPreviewType] = useState("");
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");

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
    fetchDocuments();
    fetchFolders();
  }, []);

  const fetchDocuments = async (folderId = "") => {
  try {
    const token = localStorage.getItem("token");

    const url = folderId
      ? `https://drms-backend-7azn.onrender.com/api/documents/folder/${folderId}`
      : `https://drms-backend-7azn.onrender.com/api/documents`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDocuments(response.data);

  } catch (error) {
    console.log(error);
    toast.error("Failed to load documents.");
  }
};

  const deleteDocument = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
  `https://drms-backend-7azn.onrender.com/api/documents/${id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

toast.success(response.data.message);

fetchDocuments(selectedFolder);
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  const updateDocument = async () => {
  try {
    await axios.put(
      `https://drms-backend-7azn.onrender.com/api/documents/${editingDoc._id}`,
      {
        title: editTitle,
        category: editCategory,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success("Document updated successfully");

    setEditingDoc(null);

    fetchDocuments();

  } catch (error) {
    console.log(error);
    toast.error("Update failed");
  }
};
   const toggleFavorite = async (id: string) => {
  try {
    await axios.put(
      `https://drms-backend-7azn.onrender.com/api/documents/favorite/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchDocuments();

  } catch (error) {
    console.log(error);
    toast.error("Failed to update favorite");
  }
};

const shareDocument = async (id: string) => {
  try {
    const response = await axios.get(
      `https://drms-backend-7azn.onrender.com/api/documents/share/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    await navigator.clipboard.writeText(response.data.shareLink);

    toast.success("🔗 Share link copied to clipboard!");

  } catch (error) {
    console.log(error);
    toast.error("Failed to generate share link");
  }
};

const filteredDocuments = [...documents].sort((a, b) => {
  switch (sortBy) {
    case "newest":
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );

    case "oldest":
      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );

    case "az":
      return a.title.localeCompare(b.title);

    case "za":
      return b.title.localeCompare(a.title);

    case "category":
      return a.category.localeCompare(b.category);

    default:
      return 0;
  }
});

  const sortedDocuments = [...documents].sort((a, b) => {
  switch (sortBy) {
    case "newest":
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );

    case "oldest":
      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );

    case "az":
      return a.title.localeCompare(b.title);

    case "za":
      return b.title.localeCompare(a.title);

    case "category":
      return a.category.localeCompare(b.category);

    default:
      return 0;
  }
});

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Education":
      return "bg-blue-600";

    case "Personal":
      return "bg-green-600";

    case "Resume":
      return "bg-purple-600";

    case "Certificate":
      return "bg-yellow-500 text-black";

    default:
      return "bg-gray-600";
  }
};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">

        <Navbar />

        <div className="flex justify-end mb-6">
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
  >
    <option value="newest">🆕 Newest First</option>
    <option value="oldest">📜 Oldest First</option>
    <option value="az">🔤 A → Z</option>
    <option value="za">🔡 Z → A</option>
    <option value="category">📂 Category</option>
  </select>
</div>

        <div className="max-w-7xl mx-auto p-8">

          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 shadow-xl mb-8">

            <h1 className="text-5xl font-bold text-white">
              📂 My Documents
            </h1>

            <p className="text-blue-100 mt-3 text-lg">
              View, search, download and manage all your uploaded documents.
            </p>

          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Total Documents
                </h2>

                <p className="text-blue-400 text-4xl font-bold mt-2">
                  {filteredDocuments.length}
                </p>

              </div>

              <div className="flex flex-col md:flex-row gap-4 md:w-2/3">
              <div className="mb-6">
  <label className="block text-white font-semibold mb-2">
    📁 Filter by Folder
  </label>

  <select
  value={selectedFolder}
  onChange={(e) => {
    const folderId = e.target.value;

    setSelectedFolder(folderId);

    fetchDocuments(folderId);
  }}
    className="w-full bg-gray-700 text-white p-3 rounded-lg"
  >
    <option value="">All Documents</option>

    {folders.map((folder) => (
      <option key={folder._id} value={folder._id}>
        {folder.name}
      </option>
    ))}
  </select>
</div>

  {/* Search */}
  <input
    type="text"
    placeholder="🔍 Search documents..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3"
  />

  {/* Category */}
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3"
  >
    <option value="All">All Categories</option>
    <option value="Education">Education</option>
    <option value="Personal">Personal</option>
    <option value="Resume">Resume</option>
    <option value="Certificate">Certificate</option>
    <option value="Others">Others</option>
  </select>

  {/* Sort */}
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3"
  >
    <option value="Newest">Newest First</option>
    <option value="Oldest">Oldest First</option>
    <option value="AZ">Title (A-Z)</option>
    <option value="ZA">Title (Z-A)</option>
  </select>

  {/* Favorites */}
  <label className="flex items-center gap-2 text-white whitespace-nowrap">
    <input
      type="checkbox"
      checked={showFavorites}
      onChange={(e) => setShowFavorites(e.target.checked)}
      className="w-5 h-5"
    />
    ⭐ Favorites Only
  </label>

</div>

              </div>

            </div>

                    {filteredDocuments.length === 0 ? (

            <div className="bg-gray-800 rounded-xl p-10 text-center">

              <h2 className="text-3xl text-red-400 font-bold">
                No Documents Found
              </h2>

              <p className="text-gray-400 mt-4">
                Try another search keyword or upload a new document.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {filteredDocuments.map((doc) => {

                const fileUrl = `https://drms-backend-7azn.onrender.com/uploads/${encodeURIComponent(
                  doc.fileName
                )}`;

                return (

                  <div
                    key={doc._id}
                    className="bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-blue-500/30 hover:scale-[1.03] transition-all duration-300 border border-gray-700"                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <h2 className="text-2xl font-bold text-white">
                          {getFileIcon(doc.fileName)} {doc.title}
                        </h2>

                        <span
  className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(
    doc.category
  )}`}
>
  {doc.category}
</span>

                        {doc.folder && (
  <p className="text-purple-400 text-sm">
    📁 {doc.folder.name}
  </p>
)}

<p className="text-gray-400 text-sm">
  📦 Size: {(doc.fileSize / 1024).toFixed(2)} KB
</p>

                      </div>

                    </div>

                    <div className="mt-6 space-y-2">

                      <p className="text-gray-300">
                        <strong>📄 File:</strong> {doc.fileName}
                      </p>

                      <p className="text-gray-300">
                        <strong>📅 Uploaded:</strong>{" "}
                        {new Date(doc.createdAt).toLocaleDateString("en-GB")}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-3 mt-8">
                      <button
  onClick={() => toggleFavorite(doc._id)}
  className={`px-5 py-2 rounded-lg font-semibold transition ${
    doc.isFavorite
      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
      : "bg-gray-600 hover:bg-gray-700 text-white"
  }`}
>
  {doc.isFavorite ? "⭐ Favorited" : "☆ Favorite"}
</button>

                      <button
  onClick={() => {
    setPreviewFile(fileUrl);

    const extension = doc.fileName.split(".").pop()?.toLowerCase();

    if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" ||
      extension === "gif"
    ) {
      setPreviewType("image");
    } else {
      setPreviewType("pdf");
    }
  }}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
>
  👁 Preview
</button>

                      <button
  onClick={() =>
    window.open(
      `https://drms-backend-7azn.onrender.com/api/documents/download/${doc._id}?token=${localStorage.getItem("token")}`,
      "_blank"
    )
  }
  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition"
>
  ⬇ Download
</button>

<button
  onClick={() => shareDocument(doc._id)}
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition"
>
  🔗 Share
</button> 

                      <button
  onClick={() => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditCategory(doc.category);
  }}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold transition"
>
  ✏ Edit
</button>

                      <button
                        onClick={() => deleteDocument(doc._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      </div>
      {/* Edit Document Modal */}
{editingDoc && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">

      <h2 className="text-3xl font-bold text-white mb-6">
        ✏ Edit Document
      </h2>

      <div className="space-y-5">

        <div>
          <label className="block text-gray-300 mb-2">
            Document Title
          </label>

          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Category
          </label>

          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="Education">Education</option>
            <option value="Personal">Personal</option>
            <option value="Resume">Resume</option>
            <option value="Certificate">Certificate</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">

          <button
            onClick={updateDocument}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
          >
            💾 Save
          </button>

          <button
            onClick={() => setEditingDoc(null)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  </div>
)}

{/* Document Preview Modal */}
{previewFile && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-2xl p-6 w-[90%] h-[90%] relative">

      <button
        onClick={() => {
          setPreviewFile("");
          setPreviewType("");
        }}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        ✖ Close
      </button>

      {previewType === "image" ? (
        <img
          src={previewFile}
          alt="Preview"
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <iframe
          src={previewFile}
          className="w-full h-full rounded-lg"
        />
      )}

    </div>
  </div>
)}

    </ProtectedRoute>

  );
}