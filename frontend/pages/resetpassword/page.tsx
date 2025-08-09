/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPage() {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email." });
      return;
    }

    if (!captchaValue) {
      setMessage({ type: "error", text: "Please complete the CAPTCHA." });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset` // Where user sets new password
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password reset link sent to your email." });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-20 lg:pt-30 pb-10 bg-[#f7f7fa] font-maven p-4">
      <div className="bg-white lg:p-8 p-6 px-8 w-full max-w-md lg:max-w-xl border border-[#D5D2E5] border-opacity-80 rounded-[5px] shadow-[0_0px_30px_5px_rgba(32,23,73,0.05)]">
        <div className="text-center mb-4 pt-6">
          <div className="flex justify-center mb-4">
            <div className="relative flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ADD8E6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute w-20 h-20 z-20 top-3"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
                <rect x="8" y="14" width="8" height="2" rx="1" />
              </svg>
            </div>
          </div>
          <h2 className="text-[#201749] text-[25px] lg:text-[42px] leading-[1.3] m-0 font-light">
            Recover my password
          </h2>
          <hr className="border-t border-[#D5D2E5] my-4" />
          <p className="text-sm text-gray-600 mb-4 pb-7">
            Enter the email address for your Oceanic account and we will send a reset link to your inbox.
            Follow the link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="text-sm font-medium block mb-2">Email Address *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[50px] p-3 border text-sm border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="name@example.com"
          />

          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6LdsiPkqAAAAAKTQ0AsrTskmsAePkAUM_ZKDr1ym" // Replace with your site key
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          {message && (
            <p className={`mb-4 text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
              {message.text}
            </p>
          )}

          <div className="flex flex-col items-center justify-between flex-cols lg:flex-row mb-4 gap-4 pt-3">
            <div className="lg:w-90 w-full order-1 lg:order-1">
              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="w-full text-blue-400 font-semibold text-sm border border-[#D5D2E5] rounded-lg p-3"
              >
                Cancel
              </button>
            </div>
            <div className="w-full pt-1 order-2 lg:order-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-400 text-white p-3 rounded-lg font-semibold text-sm mb-2 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Recover My Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
