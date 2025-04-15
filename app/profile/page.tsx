// app/profile/page.tsx
'use client';

import { useState, useRef } from 'react';
import { Upload, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarNav } from "@/app/dashboard/_components/sidebar-nav"
import { Header } from "@/app/dashboard/_components/header"
import { useUserSession } from '@/lib/hooks/useUserSession';

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
  const { session, status, isLoading, isAuthenticated } = useUserSession();
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [vulnFile, setVulnFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const assetInputRef = useRef<HTMLInputElement>(null);
  const vulnInputRef = useRef<HTMLInputElement>(null);

  const handleAssetClick = () => {
    assetInputRef.current?.click();
  };

  const handleVulnClick = () => {
    vulnInputRef.current?.click();
  };

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

  const handleAssetUpload = async () => {
    if (!assetFile || !session?.user?.id) {
      setUploadError("No file selected or user not logged in");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', assetFile);
    formData.append('userId', session.user.id);

    try {
      const response = await fetch('/api/upload/asset', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setAssetFile(null);
      alert('Asset inventory uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload asset inventory');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVulnUpload = async () => {
    if (!vulnFile || !session?.user?.id) {
      setUploadError("No vulnerability report file selected or user not logged in");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', vulnFile);
    formData.append('userId', session.user.id);

    try {
      const response = await fetch('/api/upload/vuln', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setVulnFile(null);
      alert('Vulnerability report uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload vulnerability report');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBothFilesAnalysis = async () => {
    if (!assetFile || !vulnFile || !session?.user?.id) {
      setAnalysisError("Both asset inventory and vulnerability report files are required");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    const formData = new FormData();
    formData.append('assetfile', assetFile);
    formData.append('scan_report', vulnFile);
    formData.append('userId', session.user.id);

    try {
      const response = await fetch('/api/upload/analysis', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAssetFile(null);
      setVulnFile(null);
      alert(`Vulnerability analysis completed successfully! Processed ${data.data?.length || 0} results.`);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to process vulnerability analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = '/Asset_Classification.xlsx';
    link.download = 'Asset_Classification.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      
      {/* Main Content */}
      <div className="flex-1">
        <Header />
        <main className="bg-gray-50 p-8">
          <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6">
              Welcome, {session.user.name}
            </h1>

            {/* Profile Card */}
            <div className="bg-white rounded-lg p-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image || "/avatar.png"}
                    alt={session.user.name || "User"}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-medium">{session.user.name}</h2>
                  <p className="text-gray-600">{session.user.email}</p>
                  <p className="text-gray-600 text-sm">{session.user.role}</p>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Inventory Upload */}
              <div>
                <h3 className="text-lg font-medium mb-4">Asset Inventory Upload</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={handleAssetClick}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleAssetDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">
                    {assetFile ? `Selected: ${assetFile.name}` : "Click or drag file to this area to upload"}
                  </p>
                  <input
                    ref={assetInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.xlsx"
                    onChange={(e) => e.target.files && setAssetFile(e.target.files[0])}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Admins are required to upload the latest Asset Inventory for vulnerability assessment. Accepted formats are .pdf and .xlsx.
                </p>
                {uploadError && (
                  <div className="mt-2 text-red-600 text-sm">
                    {uploadError}
                  </div>
                )}
                {assetFile && (
                  <Button
                    onClick={handleAssetUpload}
                    disabled={isUploading}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isUploading ? "Uploading..." : "Upload Asset Inventory"}
                  </Button>
                )}
              </div>

              {/* Vulnerability Report Upload */}
              <div>
                <h3 className="text-lg font-medium mb-4">Vulnerability Report Upload</h3>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={handleVulnClick}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleVulnDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">
                    {vulnFile ? `Selected: ${vulnFile.name}` : "Click or drag file to this area to upload"}
                  </p>
                  <input
                    ref={vulnInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.xlsx"
                    onChange={(e) => e.target.files && setVulnFile(e.target.files[0])}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Upload the latest vulnerability report scan. Accepted formats are .pdf and .xlsx.
                </p>
                {uploadError && (
                  <div className="mt-2 text-red-600 text-sm">
                    {uploadError}
                  </div>
                )}
                {vulnFile && (
                  <Button
                    onClick={handleVulnUpload}
                    disabled={isUploading}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isUploading ? "Uploading..." : "Upload Vulnerability Report"}
                  </Button>
                )}
              </div>
            </div>

            {/* Combined Analysis Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Run Vulnerability Analysis</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-700 mb-4">
                  Use this feature to send both files to our analysis engine and get AI-assisted vulnerability assessment results.
                </p>
                {analysisError && (
                  <div className="mt-2 mb-4 text-red-600 text-sm">
                    {analysisError}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Asset File:</p>
                    <p className="text-sm font-medium">{assetFile ? assetFile.name : "Not selected"}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Vulnerability File:</p>
                    <p className="text-sm font-medium">{vulnFile ? vulnFile.name : "Not selected"}</p>
                  </div>
                  <Button
                    onClick={handleBothFilesAnalysis}
                    disabled={isAnalyzing || !assetFile || !vulnFile}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isAnalyzing ? "Processing..." : "Analyze Vulnerabilities"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Templates Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Download Templates</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-700 mb-4">
                  Download template files for asset inventory and vulnerability reports to ensure proper format for uploads.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleDownloadTemplate} variant="outline">
                    Download Asset Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}