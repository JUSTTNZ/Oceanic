
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function PasswordChangeModal({ user, onClose }: {
  user: {
    email: string;
    username: string;
    phoneNumber: string;
  };
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('https://oceanic-servernz.vercel.app/api/v1/users/changePassword', {
        
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
    
        },
  
          credentials: "include",
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      toast.success('Password changed successfully!');
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
     const errorMessage = error instanceof Error ? error.message : "An error occurred while changing password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-2xl rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Change Password{user.email}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isLoading}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleChangePassword}>
          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                minLength={8}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters
              </p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}