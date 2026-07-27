"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardChart from "../../components/DashboardChart";

import {
  FileText,
  Folder,
  HardDrive,
} from "lucide-react";
import DashboardCard from "../../components/DashboardCard";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalCategories: 0,
  });

  const [documents, setDocuments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [storage, setStorage] = useState({
  used: 0,
  total: 100 * 1024 * 1024,
});
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [monthlyUploads, setMonthlyUploads] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

const [
  statsRes,
  docsRes,
  activityRes,
  storageRes,
  recentRes,
  monthlyRes,
] = await Promise.all([  
  axios.get("https://drms-backend-7azn.onrender.com/api/documents/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  axios.get("https://drms-backend-7azn.onrender.com/api/documents", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  axios.get("https://drms-backend-7azn.onrender.com/api/activity", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  axios.get("https://drms-backend-7azn.onrender.com/api/documents/storage", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
 
  axios.get("https://drms-backend-7azn.onrender.com/api/documents/recent", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  axios.get("https://drms-backend-7azn.onrender.com/api/documents/monthly-uploads", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}),
]);

setStats(statsRes.data);
setDocuments(docsRes.data.slice(0, 5));
setActivities(activityRes.data);
setStorage(storageRes.data);
setRecentDocuments(recentRes.data);
setMonthlyUploads(monthlyRes.data);
console.log("Monthly Uploads:", monthlyRes.data);

    console.log("Stats:", statsRes.data);
    console.log("Documents:", docsRes.data);

    setStats(statsRes.data);
    setDocuments(docsRes.data.slice(0, 5));

  } catch (error) {
    console.log(error);
  }
};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">

        <Navbar />

        <div className="max-w-7xl mx-auto p-8">

          {/* Welcome */}

          <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl p-10 shadow-xl">

            <h1 className="text-5xl font-bold text-white">
              📂 Digital Record Management System
            </h1>

            <p className="text-blue-100 text-xl mt-4">
              Welcome back,
              <span className="font-bold">
                {" "}
                {user?.name || "User"}
              </span>
              👋
            </p>

            <p className="text-blue-200 mt-2">
              Manage all your important records securely.
            </p>

          </div>

            {/* Statistics */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

  <DashboardCard
    title="Documents"
    value={stats.totalDocuments}
    icon={<FileText size={40} />}
    color="bg-blue-600"
  />

  <DashboardCard
    title="Categories"
    value={stats.totalCategories}
    icon={<Folder size={40} />}
    color="bg-green-600"
  />

  <DashboardCard
    title="Storage"
    value={`${(storage.used / 1024 / 1024).toFixed(2)} MB`}
    icon={<HardDrive size={40} />}
    color="bg-purple-600"
  />

</div>

{/* Quick Actions */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            <Link
              href="/upload"
              className="bg-blue-600 hover:bg-blue-700 rounded-xl p-6 text-center transition"
            >
              <h2 className="text-2xl font-bold text-white">
                📤 Upload
              </h2>
            </Link>

            <Link
              href="/documents"
              className="bg-green-600 hover:bg-green-700 rounded-xl p-6 text-center transition"
            >
              <h2 className="text-2xl font-bold text-white">
                📂 Documents
              </h2>
            </Link>

            <Link
              href="/profile"
              className="bg-purple-600 hover:bg-purple-700 rounded-xl p-6 text-center transition"
            >
              <h2 className="text-2xl font-bold text-white">
                👤 Profile
              </h2>
            </Link>

          </div>

          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mt-8">
  <h2 className="text-2xl font-bold text-white mb-4">
    💾 Storage Usage
  </h2>

  <div className="w-full bg-gray-700 rounded-full h-5">
    <div
  className="bg-green-500 h-5 rounded-full transition-all duration-500"
  style={{
    width: `${Math.max(
      (storage.used / storage.total) * 100,
      2
    )}%`,
  }}
/>
  </div>


  <p className="text-gray-300 mt-4">
    {(storage.used / 1024 / 1024).toFixed(2)} MB used of{" "}
    {(storage.total / 1024 / 1024).toFixed(0)} MB
  </p>

  <p className="text-green-400 font-bold mt-2">
    {((storage.used / storage.total) * 100).toFixed(1)}% Used
  </p>
</div>

<DashboardChart data={monthlyUploads} />


          {/* Recent Documents */}

          <div className="bg-gray-800 rounded-2xl shadow-xl mt-10 p-8">

            <h2 className="text-3xl font-bold text-white mb-6">
              📂 Recent Documents
            </h2>

            {recentDocuments.length === 0 ? (

              <p className="text-gray-400">
                No documents uploaded yet.
              </p>

            ) : (

              <div className="space-y-4">

                {recentDocuments.map((doc) => (

                  <div
                    key={doc._id}
                    className="flex justify-between items-center bg-gray-700 rounded-lg p-4"
                  >

                    <div>

                      <h3 className="text-white font-bold">
                        {doc.title}
                      </h3>

                      <p className="text-gray-400">
                        {doc.category}
                      </p>

                    </div>

                    <span className="text-blue-400">
                      {new Date(
                        doc.createdAt
                      ).toLocaleDateString("en-GB")}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>

          <div className="bg-gray-800 rounded-2xl shadow-xl mt-10 p-8">

  <h2 className="text-3xl font-bold text-white mb-6">
    📌 Recent Activity
  </h2>

  {activities.length === 0 ? (

    <p className="text-gray-400">
      No recent activities.
    </p>

  ) : (

    <div className="space-y-4">

      {activities.map((activity) => (

        <div
          key={activity._id}
          className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
        >

          <div>

            <h3 className="text-white font-semibold">
              {activity.action}
            </h3>

            {activity.documentTitle && (
              <p className="text-blue-400">
                {activity.documentTitle}
              </p>
            )}

          </div>

          <span className="text-gray-400 text-sm">
            {new Date(activity.createdAt).toLocaleString("en-GB")}
          </span>

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