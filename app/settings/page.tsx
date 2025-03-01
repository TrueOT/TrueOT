'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { SidebarNav } from "@/app/dashboard/_components/sidebar-nav";
import { Header } from "@/app/dashboard/_components/header";
import { useUserSession } from '@/lib/hooks/useUserSession';

export default function SettingsPage() {
  const { session, status, isLoading, isAuthenticated, updateUserProfile, deleteUserAccount } = useUserSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !session?.user) {
    return <div>Not authenticated</div>;
  }

  const handleEditProfile = () => {
    setIsEditing(true);
    setName(session.user.name || '');
    setError(null);
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || name.length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    setIsUpdating(true);
    setError(null);

    const result = await updateUserProfile({ name });
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setError(result.error || 'Failed to update profile');
    }
    
    setIsUpdating(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteUserAccount();
    
    if (!result.success) {
      setDeleteError(result.error || 'Failed to delete account');
      setIsDeleting(false);
    }
    // No need to handle success case as the user will be redirected to login page
  };

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      
      {/* Main Content */}
      <div className="flex-1">
        <Header />
        <main className="bg-gray-50 p-8">
          <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6">Settings</h1>

            {/* Profile Settings Card */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h2 className="text-xl font-medium mb-4">Profile Settings</h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                      }}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
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
                  <Button 
                    variant="outline" 
                    className="text-purple-600 border-purple-600"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>

            {/* Account Settings Card */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h2 className="text-xl font-medium mb-4">Account Settings</h2>
              
              {deleteError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                  {deleteError}
                </div>
              )}
              
              {showDeleteConfirm ? (
                <div className="space-y-4">
                  <p className="text-red-600">Are you sure you want to delete your account? This action cannot be undone.</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-gray-600 text-sm">Permanently delete your account and all associated data</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete My Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 