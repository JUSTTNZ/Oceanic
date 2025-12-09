import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { supabase } from '@/lib/supabase';
import { toast } from "react-hot-toast";
import { clearUser } from '@/action';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface LogoutProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export default function LogoutM({ showModal, setShowModal }: LogoutProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Sign out from Supabase (this invalidates the token)
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase sign out error:', error);
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
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4"
          onClick={() => !isLoggingOut && setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-800 relative"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
              disabled={isLoggingOut}
              aria-label="Close modal"
              title="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2 text-white">Sign Out</h2>
              <p className="text-sm text-gray-400">
                Are you sure you want to sign out of your account?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-5 py-2.5 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all duration-200 font-medium border border-gray-700 hover:border-gray-600"
                disabled={isLoggingOut}
                aria-label="Cancel sign out"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoggingOut}
                aria-label="Confirm sign out"
              >
                {isLoggingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing Out...
                  </span>
                ) : (
                  'Sign Out'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}