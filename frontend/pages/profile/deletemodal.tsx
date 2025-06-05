
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function DeleteModal({ user, onClose }: {
  user: {
    email: string;
    username: string;
    phoneNumber: string;
  };
  onClose: () => void;
}) {
    const router = useRouter();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    
    try {
     
      const response = await fetch(`${process.env.SERVER_BASE_URL}/api/v1/users/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
          credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      // Clear user data from storage/local state
     

     router.push("/login");
    } catch (error) {
     const errorMessage = error instanceof Error ? error.message :"An error occurred while deleting account"
    toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-2xl rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isDeleting}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete your account {user.email}? This action cannot be undone. All your data will be permanently removed.
          </p>
        </div>
        
        <form onSubmit={handleDeleteAccount}>
          <div className="mb-4">
            <label htmlFor="delete-confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Type `DELETE` to confirm
            </label>
            <input
              type="text"
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
              disabled={isDeleting}
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={deleteConfirmation !== 'DELETE' || isDeleting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                deleteConfirmation === 'DELETE' && !isDeleting 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-300 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}