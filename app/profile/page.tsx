// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { Upload, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarNav } from "@/app/dashboard/_components/sidebar-nav"
import { Header } from "@/app/dashboard/_components/header"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Setting",
    href: "/settings",
    icon: Settings,
  },
];

export default function ProfilePage() {
  const pathname = usePathname();
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [vulnFile, setVulnFile] = useState<File | null>(null);

  const handleAssetDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.xlsx'))) {
      setAssetFile(file);
    }
  };

  const handleVulnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setVulnFile(file);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      
      {/* Main Content */}
      <div className="flex-1">
        <Header />
        <main className="bg-gray-50 p-8">
          <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6">Welcome, Ahmed</h1>

            {/* Profile Card */}
            <div className="bg-white rounded-lg p-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src="/avatar.png"
                    alt="Ahmed"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-medium">Ahmed</h2>
                  <p className="text-gray-600">Ahmed@iau.edu.sa</p>
                </div>
              </div>
              <Button variant="outline" className="text-purple-600 border-purple-600">
                Edit
              </Button>
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Inventory Upload */}
              <div>
                <h3 className="text-lg font-medium mb-4">Asset Inventory Upload</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleAssetDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">Click or drag file to this area to upload</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.xlsx"
                    onChange={(e) => e.target.files && setAssetFile(e.target.files[0])}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Admins are required to upload the latest Asset Inventory file for vulnerability assessment. Accepted formats are .pdf and .xlsx.
                </p>
              </div>

              {/* Vulnerability Report Upload */}
              <div>
                <h3 className="text-lg font-medium mb-4">Vulnerability Report Upload</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleVulnDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">Click or drag file to this area to upload</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files && setVulnFile(e.target.files[0])}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Admins are required to upload the latest Vulnerability Report for vulnerability assessment.
                </p>
              </div>
            </div>

            {/* Template Download */}
            <div className="mt-6">
              <p className="text-gray-600 mb-2">If you do not have a file you can use the sample below:</p>
              <Button variant="outline" className="text-green-600 border-green-600">
                Download Sample Template
              </Button>
            </div>

            {/* Upload Button */}
            <div className="mt-8">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg">
                UPLOAD FILES
              </Button>
              <p className="text-center text-sm text-gray-500 mt-2">
                Please ensure you upload both files Asset Inventory and Vulnerability Report
              </p>
            </div>

            {/* Delete Account */}
            <div className="mt-8 flex justify-end">
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                Delete My Account
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}