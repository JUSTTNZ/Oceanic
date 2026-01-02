import { useState } from "react";
import { FiX, FiCheck, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { updateUser } from "@/action";
import { useDispatch } from "react-redux";
import { apiClients } from "@/lib/apiClient";

export default function EditProfileModal({
  user,
  onClose,
}: {
  user: {
    email: string;
    username: string;
    fullname: string;
  };
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullname: user.fullname,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      dispatch(
        updateUser({
          fullname: data.profile.fullname,
        })
      );
      toast.success("Profile updated successfully!", {
        duration: 3000,
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
      console.log(data);
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating profile";
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-grotesk animate-fadeIn">
      <div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-700/50 flex justify-between items-center bg-gradient-to-r from-blue-900/10 to-blue-600/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center shadow-lg">
              <FiUser className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400">
              Edit Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg p-2 transition-all"
            disabled={isSubmitting}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Read-only fields */}
            <div className="space-y-4">
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <p className="text-sm text-gray-300 font-medium">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Username
                </label>
                <p className="text-sm text-gray-300 font-medium">@{user.username}</p>
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>
            </div>

            {/* Editable Full Name Field */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
              >
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                  disabled={isSubmitting}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This name will be displayed on your profile
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700/50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-5 py-2.5 border border-gray-600 text-sm font-semibold rounded-xl text-gray-300 bg-gray-700/30 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all will-change-transform"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add these styles to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}