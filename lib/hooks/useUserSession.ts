'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useUserSession() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // This effect will run whenever the session changes
  useEffect(() => {
    // Force a router refresh when session changes
    if (status === 'authenticated') {
      router.refresh();
    }
  }, [session, status, router]);

  const updateUserProfile = async (userData: { name?: string }) => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update the session with the new user data
      await update({
        user: {
          ...session?.user,
          ...data.user,
        }
      });

      // Force a hard refresh to ensure all components get the updated data
      window.location.reload();
      
      return { success: true, data };
    } catch (error) {
      console.error('Update error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  };

  const deleteUserAccount = async () => {
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Sign out the user after successful deletion
      await signOut({ callbackUrl: '/login' });
      
      return { success: true, data };
    } catch (error) {
      console.error('Delete account error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete account' 
      };
    }
  };

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    updateUserProfile,
    deleteUserAccount,
  };
} 