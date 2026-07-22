"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  Upload,
  Folder,
  Trash2,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <h1 className="text-2xl font-bold">
          📁 DRMS
        </h1>

        <div className="flex items-center gap-6">

          <Link href="/dashboard" className="flex items-center gap-2 hover:text-yellow-300">
  <LayoutDashboard size={18} />
  Dashboard
</Link>

<Link href="/documents" className="flex items-center gap-2 hover:text-yellow-300">
  <FileText size={18} />
  Documents
</Link>

<Link href="/upload" className="flex items-center gap-2 hover:text-yellow-300">
  <Upload size={18} />
  Upload
</Link>

<Link href="/folders" className="flex items-center gap-2 hover:text-yellow-300">
  <Folder size={18} />
  Folders
</Link>

<Link href="/recycle-bin" className="flex items-center gap-2 hover:text-yellow-300">
  <Trash2 size={18} />
  Recycle Bin
</Link>

<Link href="/profile" className="flex items-center gap-2 hover:text-yellow-300">
  <User size={18} />
  Profile
</Link>

<button
  onClick={logout}
  className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
>
  <LogOut size={18} />
  Logout
</button>

        </div>
      </div>
    </nav>
  );
}