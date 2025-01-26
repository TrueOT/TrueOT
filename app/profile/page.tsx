// app/profile/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Upload } from 'lucide-react';

const ProfilePage = () => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="TrueOT Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold">TrueOT</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <span className="sr-only">Theme</span>
              {/* Add theme icon */}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <span className="sr-only">History</span>
              {/* Add history icon */}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Welcome, Ahmed</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src="/avatar.png"
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Ahmed</h2>
              <p className="text-gray-600">Ahmed@iau.edu.sa</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
              Edit
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Asset Inventory Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Asset Inventory Upload</h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleAssetDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Click or drag file to this area to upload</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.xlsx"
                onChange={(e) => e.target.files && setAssetFile(e.target.files[0])}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Admins are required to upload the latest Asset Inventory file for
              vulnerability assessment. Accepted formats are .pdf and .xlsx.
            </p>
          </div>

          {/* Vulnerability Report Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Vulnerability Report Upload</h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleVulnDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Click or drag file to this area to upload</p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => e.target.files && setVulnFile(e.target.files[0])}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Admins are required to upload the latest Vulnerability Report for
              vulnerability assessment.
            </p>
          </div>
        </div>

        {/* Template Download */}
        <div className="mt-8">
          <p className="text-gray-600 mb-4">
            If you do not have a file you can use the sample below:
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <svg
              className="mr-2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Sample Template
          </button>
        </div>

        {/* Upload Button */}
        <div className="mt-8">
          <button className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600">
            UPLOAD FILES
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            Please ensure you upload both files Asset Inventory and Vulnerability Report
          </p>
        </div>

        {/* Delete Account */}
        <div className="mt-8 text-right">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete My Account
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;