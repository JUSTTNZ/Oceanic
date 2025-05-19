"use client";

import { setUser } from "@/action";
//import toast from 'react-hot-toast';
import { useToast } from "../../hooks/toast";
import Link from "next/link";
import { useRouter } from "next/router";
import {  useState  } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {  signInWithPopup,  } from "firebase/auth";
import { auth, googleProvider } from '../../firebase';
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const [error, setError] = useState({
    email: "",
    password: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Clear the specific error message immediately when the user types
  if (error[name as keyof typeof error]) {
    setError((prev) => ({ ...prev, [name]: "" }));
  }
  if (error.general) {
    setError((prev) => ({ ...prev, general: "" }));
  }
  // Clear general error after 2 seconds if it exists

};


  const validateForm = () => {
    let isValid = true;
    const newError = { ...error };

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError({
      email: "",
      password: "",
      general: "",
    });

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await fetch("https://oceanic-servernz.vercel.app/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data)
      if (!response.ok || !data.data) {
        const errorMessage = data.message || data.error || "Login failed";
        // setError((prev) => ({ ...prev, general: errorMessage }));
        showToast(errorMessage, "error"); 
        return;
      }

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      
      // Fetch user data from /auth/me
      const userRes = await fetch("https://oceanic-servernz.vercel.app/api/v1/users/getCurrentUser", {
        headers: {
          Authorization: `Bearer ${data.data.accessToken}`,
        },
      });

      console.log(userRes)
      const userData = await userRes.json();

      if (userRes.ok && userData?.data) {
        console.log(userData)
        dispatch(setUser({
          uid: userData.data._id,
          email: userData.data.email,
          username: userData.data.username,
          role: userData.data.role,
          fullname: userData.data.fullname,
          createdAt: userData.data.createdAt,
          phoneNumber: userData.data.phoneNumber,
          lastLogin: new Date().toISOString(),
        }));
      }
      console.log(data.user?.role)
      if (userData.data.role === "admin" || userData.data.role === "superadmin") {
        showToast("Welcome Admin!", "success");
        router.push("/adminpage");
      } else {
        showToast("Login successful", "success");
        router.push("/markets");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      showToast(errorMessage, "error"); // ✅ Red toast
      console.error("Login error:", err);
    }

 finally {
      setLoading(false);
    }
  };

//  useEffect(() => {
//   if (error.general) {
//     const timer = setTimeout(() => {
//       setError((prev) => ({ ...prev, general: "" }));
//     }, 2000);
//     // Cleanup function to clear the timeout if the component unmounts or error changes
//     return () => clearTimeout(timer);
//   }
// }, [error.general]);

 const handleGoogleLogin = async () => {

  try {
    const credential = await signInWithPopup(auth, googleProvider);
        const user = credential.user;
        const idToken = await user.getIdToken();
  
    const response = await fetch("https://oceanic-servernz.vercel.app/api/v1/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
      credentials: "include" 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Google login failed");
    }

    // 4. Handle successful response
    const data = await response.json();
    console.log("goo",data)

         localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      
      // Fetch user data from /auth/me
      const userRes = await fetch("https://oceanic-servernz.vercel.app/api/v1/users/getCurrentUser", {
        headers: {
          Authorization: `Bearer ${data.data.accessToken}`,
        },
      });
            console.log(userRes)
      const userData = await userRes.json();

      if (userRes.ok && userData?.data) {
        console.log(userData)
        dispatch(setUser({
          uid: userData.data._id,
          email: userData.data.email,
          username: userData.data.username,
          role: userData.data.role,
          fullname: userData.data.fullname,
          createdAt: userData.data.createdAt,
          phoneNumber: userData.data.phoneNumber,
          lastLogin: new Date().toISOString(),
        }));
      }
      console.log(data.user?.role)
if (userData.data.role === "admin" || userData.data.role === "superadmin") {
  router.push("/adminpage");
} else  {
  router.push("/markets");  
}
    
  } catch (error) {
    console.error("Google login error:", error);
    const errorMessage = 'Google login failed. Please try again.';
        

    setError(prev => ({
          ...prev,
          general: errorMessage
        }));
  
  }
};

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
  <div className="relative bg-gray-800/50 backdrop-blur-lg lg:p-10 p-6 w-full max-w-md lg:max-w-xl border border-gray-600/30 rounded-2xl shadow-xl overflow-hidden">
    {/* Gradient background elements */}
   <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100/50 rounded-full filter blur-3xl"></div>
    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-100/30 rounded-full filter blur-3xl"></div>
    
    <div className="relative z-10">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full border border-gray-600/30 shadow-lg">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-16 h-16"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
              <rect x="8" y="14" width="8" height="2" rx="1" />
            </svg>
          </div>
        </div>
       
        <h2 className="text-3xl lg:text-4xl font-light text-gray-100 mb-2">Sign in</h2>
        <p className="text-sm text-gray-400 mb-4">Please check that you are visiting the correct URL</p>
        <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full mb-6">
          <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-400 text-sm">https://app.oceanic.io/signin</span>
        </div>
      </div>

      {/* {error.general && (
        <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg text-sm border border-red-800/50">
          {error.general}
        </div>
      )} */}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="text-sm block text-gray-300 mb-2">Email*</label>
          <input
            type="email"
            name="email"
            className={`w-full h-12 px-4 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
              error.email ? "border-red-500" : "border-gray-600/50"
            }`}
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
          />
          {error.email && <p className="text-sm text-red-400 mt-1">{error.email}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-300 text-sm">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              className={`w-full h-12 px-4 bg-gray-700/50 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 ${
                error.password ? "border-red-500" : "border-gray-600/50"
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400 hover:text-gray-300" />
              ) : (
                <FaEye className="text-gray-400 hover:text-gray-300" />
              )}
            </button>
          </div>
          {error.password && <p className="text-sm text-red-400 mt-1">{error.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-medium text-sm hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center h-12"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
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
                  d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-700/50"></div>
        <span className="mx-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-700/50"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 p-3 rounded-lg font-medium text-sm transition-all duration-300 border border-gray-600/50 flex justify-center items-center h-12 mb-6"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.115H19.28C21.36 18.14 22.56 15.42 22.56 12.25Z" fill="#4285F4"/>
          <path d="M12 23C14.97 23 17.46 22.015 19.28 20.115L15.725 17.575C14.74 18.235 13.48 18.625 12 18.625C9.135 18.625 6.71 16.69 5.845 14.09H2.17V16.66C3.98 20.235 7.7 23 12 23Z" fill="#34A853"/>
          <path d="M5.845 14.09C5.625 13.43 5.5 12.725 5.5 12C5.5 11.275 5.625 10.57 5.845 9.91V7.34H2.17C1.4 8.735 1 10.315 1 12C1 13.685 1.4 15.265 2.17 16.66L5.845 14.09Z" fill="#FBBC05"/>
          <path d="M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.7 1 3.98 3.765 2.17 7.34L5.845 9.91C6.71 7.31 9.135 5.375 12 5.375Z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="text-center text-sm text-gray-400">
        <div className="mb-2">
          <Link href="/resetpassword" className="hover:text-blue-400 transition-colors">
            Forgot Password?
          </Link>
        </div>
        <p>
          Not signed up yet?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  </div>
  {ToastComponent}
</div>
  );
}
