"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function SharedDocument() {
  const params = useParams();
  const token = params.token as string;

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDocument();
    }
  }, [token]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(
        `https://drms-backend-7azn.onrender.com/api/documents/shared/${token}`
      );

      setDocument(response.data);

    } catch (error) {
      console.log(error);
      alert("Shared document not found.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-red-400">
        Document not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-xl">

        <h1 className="text-3xl text-white font-bold mb-6">
          📄 Shared Document
        </h1>

        <p className="text-white">
          <strong>Title:</strong> {document.title}
        </p>

        <p className="text-white mt-3">
          <strong>Category:</strong> {document.category}
        </p>

        <a
        href={`https://drms-backend-7azn.onrender.com/api/documents/shared/download/${token}`}        
        className="block mt-8 bg-blue-600 hover:bg-blue-700 text-center text-white py-3 rounded-lg"
        >
          ⬇ Download Document
        </a>

      </div>
    </div>
  );
}