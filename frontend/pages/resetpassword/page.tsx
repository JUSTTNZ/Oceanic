"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { useToast } from "../../hooks/toast";
import { motion } from "framer-motion";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (!captchaValue) {
      showToast("Please complete the reCAPTCHA", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/forgotPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      showToast("Password reset link sent! Check your inbox.", "success");

      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-20 pb-10 bg-[#f7f7fa] font-maven p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-6 lg:p-8 w-full max-w-md border border-[#D5D2E5] rounded-lg shadow-lg"
      >
        <div className="text-center mb-6 pt-4">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="relative flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full"
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-16 h-16"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
                <rect x="8" y="14" width="8" height="2" rx="1" />
              </svg>
            </motion.div>
          </div>
          <h2 className="text-[#201749] text-2xl font-light">
            Recover My Password
          </h2>
          <hr className="border-t border-[#D5D2E5] my-4" />
          <p className="text-sm text-gray-600 mb-4">
            Enter your account email and we’ll send a reset link to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="text-sm font-medium block mb-2">
            Email Address *
          </label>
          <input
            type="email"
            className="w-full h-[45px] p-3 border text-sm border-[#D5D2E5] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6LdsiPkqAAAAAKTQ0AsrTskmsAePkAUM_ZKDr1ym"
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 pt-3">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full border border-[#D5D2E5] rounded-lg p-3 text-blue-400 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-400 text-white p-3 rounded-lg font-semibold text-sm disabled:opacity-50"
            >
              {loading ? "Sending..." : "Recover My Password"}
            </button>
          </div>
        </form>
      </motion.div>
      {ToastComponent}
    </div>
  );
}
