import { useSelector } from "react-redux";
import Footer from "../login/footer";
import Header from "../login/header";
import { FiEdit, FiUser, FiMail, FiShield, FiGlobe, FiClock, FiCheckCircle, FiKey, FiTrash2 } from "react-icons/fi";
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
    fullname: string;
    createdAt: string;
    country: string;
    lastLogin: string;
  };
}

export default function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const lastLoginTime = user?.lastLogin;
  const formattedLastLogin = lastLoginTime ? timeAgo(lastLoginTime) : "Never logged in";

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [user, router]);

  if (checkingAuth) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Header />
      <div className="p-4 pt-24 pb-20 font-grotesk">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white to-gray-200 flex items-center justify-center text-blue-600 text-4xl font-bold shadow-xl ring-4 ring-white/30">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
    
                </div>
                <div className="ml-0 md:ml-6 text-center md:text-left mt-4 md:mt-0">
                  <h1 className="text-3xl font-bold text-white mb-1">{user?.fullname}</h1>
                  <p className="text-blue-100 text-lg mb-2">@{user?.username}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                      {user?.roles === "admin" ? "Admin" : "User"}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-xs font-semibold text-green-100 flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-lg">
                <p className="text-sm text-blue-100 mb-1">Member since</p>
                <p className="font-bold text-white text-lg">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Profile Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information Card */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden hover:border-blue-500/30 transition-all">
              <div className="px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-800/50">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Personal Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="group flex items-start p-4 rounded-xl hover:bg-gray-700/30 transition-all">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiMail className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-400 mb-1">Email Address</p>
                    <p className="text-base text-gray-100 font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="group flex items-start p-4 rounded-xl hover:bg-gray-700/30 transition-all">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiUser className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-400 mb-1">Username</p>
                    <p className="text-base text-gray-100 font-medium">@{user?.username}</p>
                  </div>
                </div>

                <div className="group flex items-start p-4 rounded-xl hover:bg-gray-700/30 transition-all">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiGlobe className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-400 mb-1">Country</p>
                    <p className="text-base text-gray-100 font-medium">🇳🇬 Nigeria</p>
                  </div>
                </div>

                <div className="group flex items-start p-4 rounded-xl hover:bg-gray-700/30 transition-all">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiClock className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-400 mb-1">Last Login</p>
                    <p className="text-base text-gray-100 font-medium">{formattedLastLogin}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700/50 flex justify-end">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-blue-500/50 hover:scale-105"
                >
                  <FiEdit className="mr-2" /> Edit Profile
                </button>
              </div>
            </div>

            {/* Security Actions Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden hover:border-purple-500/30 transition-all">
              <div className="px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-800/50">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Security
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <FiShield className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Account Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30">
                          ✓ VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
                    Security Actions
                  </h3>

                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="group w-full flex items-center justify-between px-5 py-4 bg-gray-700/30 rounded-xl hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 border border-gray-600/30 hover:border-blue-500/50 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiKey className="text-blue-400 h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-200">Change Password</p>
                        <p className="text-xs text-gray-400">Update your password</p>
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setShowDeleteAccountModal(true)}
                    className="group w-full flex items-center justify-between px-5 py-4 bg-gray-700/30 rounded-xl hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 border border-gray-600/30 hover:border-red-500/50 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiTrash2 className="text-red-400 h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-red-400">Delete Account</p>
                        <p className="text-xs text-gray-400">Permanently remove account</p>
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats (Optional Enhancement) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/10 backdrop-blur-sm rounded-xl p-5 border border-blue-500/30 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300 font-medium">Total Transactions</p>
                  <p className="text-3xl font-bold text-white mt-1">0</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-500/30 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/10 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300 font-medium">Account Age</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {Math.floor((Date.now() - new Date(user?.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <FiClock className="h-6 w-6 text-purple-300" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-600/10 backdrop-blur-sm rounded-xl p-5 border border-green-500/30 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300 font-medium">Security Level</p>
                  <p className="text-3xl font-bold text-white mt-1">High</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-500/30 flex items-center justify-center">
                  <FiShield className="h-6 w-6 text-green-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && <EditProfileModal user={user} onClose={() => setIsEditModalOpen(false)} />}
      {showChangePasswordModal && <PasswordChangeModal user={user} onClose={() => setShowChangePasswordModal(false)} />}
      {showDeleteAccountModal && <DeleteModal user={user} onClose={() => setShowDeleteAccountModal(false)} />}

      <Footer />
    </section>
  );
}