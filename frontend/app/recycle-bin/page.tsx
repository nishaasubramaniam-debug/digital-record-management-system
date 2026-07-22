"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { toast } from "react-toastify";

export default function RecycleBinPage() {
  const [documents, setDocuments] = useState<any[]>([]);

  const fetchRecycleBin = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/documents/recycle-bin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(response.data);

    } catch (error: any) {
  console.log("Recycle Bin Error:", error);

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
  }

  toast.error("Failed to load recycle bin.");
}
  };

  useEffect(() => {
    fetchRecycleBin();
  }, []);

  const restoreDocument = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `http://localhost:5000/api/documents/restore/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);

    fetchRecycleBin();

  } catch (error) {
    console.log(error);
    toast.error("Restore failed.");
  }
}; 

const deleteForever = async (id: string) => {
  if (!window.confirm("Delete this document permanently?")) return;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `http://localhost:5000/api/documents/delete-forever/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);

    fetchRecycleBin();

  } catch (error) {
    console.log(error);
    toast.error("Delete failed.");
  }
};

const emptyRecycleBin = async () => {
  if (!window.confirm("Empty the Recycle Bin?")) return;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      "http://localhost:5000/api/documents/empty-recycle-bin",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response.data.message);

    fetchRecycleBin();

  } catch (error) {
    console.log(error);
    toast.error("Failed to empty recycle bin.");
  }
};


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Navbar />

        <div className="max-w-6xl mx-auto p-8">

          <div className="flex justify-end mb-6">
  <button
    onClick={emptyRecycleBin}
    className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-bold"
  >
    🧹 Empty Recycle Bin
  </button>
</div>

          {documents.length === 0 ? (
            <div className="bg-gray-800 p-10 rounded-xl text-center">
              <p className="text-gray-400 text-xl">
                Recycle Bin is empty.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-gray-800 rounded-xl p-6 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-2xl text-white font-bold">
                      📄 {doc.title}
                    </h2>

                    <p className="text-gray-400">
                      Category: {doc.category}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Deleted On:{" "}
                      {new Date(doc.updatedAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  <div className="flex gap-3">

                    <button
  onClick={() => restoreDocument(doc._id)}
  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-bold"
>
  ♻️ Restore
</button>

                    <button
  onClick={() => deleteForever(doc._id)}
  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-bold"
>
  ❌ Delete Forever
</button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </ProtectedRoute>
  );
}