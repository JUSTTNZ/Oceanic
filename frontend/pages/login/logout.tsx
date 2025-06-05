import { useState } from 'react';

import { useRouter } from 'next/router'; 
import { useDispatch } from 'react-redux';

import { toast } from "react-hot-toast";
import { clearUser } from '@/action';
interface LogoutProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export default function LogoutM({ setShowModal }: LogoutProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Call logout endpoint (clears cookies server-side)
      const response = await fetch(
        `${process.env.SERVER_BASE_URL}/api/v1/users/logout`,
        {
          method: 'POST',
          credentials: 'include', // Required for cookies!
        }
      );

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // 2. Clear client-side state
      dispatch(clearUser()); // Redux
    

      // 3. Redirect to login
      router.push('/login');
      toast.success('Logged out successfully');

    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
      setShowModal(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
        <p className="text-sm text-gray-100 mb-6">Are you sure you want to sign out?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 transition-all"
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
}