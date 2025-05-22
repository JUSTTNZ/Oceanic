import { useSelector } from "react-redux";
import Footer from "../login/footer";
import Header from "../login/header";
import { FiEdit, FiUser, FiMail, FiPhone, FiShield, FiGlobe } from "react-icons/fi";

import { useEffect, useState } from "react";
import EditProfileModal from "./modal";
import { useRouter } from "next/router";
import timeAgo from "./time";
import DeleteModal from "./deletemodal";
import PasswordChangeModal from "./passwordmodal";
interface RootState {
    user: {
      uid: number;
      email: string;
      username: string;
      roles: string;
      fullname:string;
      phoneNumber:string;
      createdAt:string;
      country:string;
      lastLogin:string
    };
  }
  
export default function Profile() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const formattedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  const lastLoginTime = user.lastLogin;

  // Format the last login time
  const formattedLastLogin = lastLoginTime ? timeAgo(lastLoginTime) : 'Never logged in';
//   const handleSaveProfile = (updatedData:void) => {
//     // Update your user data here (API call, state update, etc.)
//     console.log("Updated data:", updatedData);
//   };
 const router = useRouter();

      const [checkingAuth, setCheckingAuth] = useState(true);
    
      useEffect(() => {
        if (!user) {
          router.replace("/login");
        } else {
          setCheckingAuth(false);
        }
      }, [user, router]);
    
      // Don't render anything while checking auth
      if (checkingAuth) return null;

  return (
    <section className="bg-gray-50">
      <Header />
      <div className="min-h-screen p-4 pt-20 pb-16 font-grotesk">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <FiEdit className="text-blue-600" />
                </button>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{user?.fullname}</h1>
                <p className="text-gray-600">@{user?.username}</p>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FiMail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                    <FiPhone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="mt-1 text-sm text-gray-900">{user?.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center">
                    <FiGlobe className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p className="mt-1 text-sm text-gray-900">{"Nigeria"}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600  cursor-pointer">
                  <FiEdit className="mr-2" /> Edit Profile
                </button>
              </div>
              <>
              {isEditModalOpen && (
  <EditProfileModal
    user={user} 
    onClose={() => setIsEditModalOpen(false)}
    
  />
)}

              </>
            </div>

            {/* Account Security Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FiShield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Verification Status</p>
                    <div className="mt-1 flex items-center">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {"Verified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="mt-1 text-sm text-gray-900">{formattedLastLogin}</p>
                  </div>
                </div>

                 <div className="pt-4">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Security Actions</h3>
      <div className="space-y-2">
        <button 
          onClick={() => setShowChangePasswordModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">Change Password</span>
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button 
          onClick={() => setShowDeleteAccountModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-red-600">Delete Account</span>
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <PasswordChangeModal
         user={user} 
    onClose={() => setShowChangePasswordModal(false)}

        />
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
      <DeleteModal
    user={user}
     onClose={() => setShowDeleteAccountModal(false)}

      />
      )}
    </div>

              </div>
            </div>

        
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}