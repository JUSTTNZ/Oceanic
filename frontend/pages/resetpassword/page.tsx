
"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";


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

  try {
    setLoading(true);

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/recover`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          captchaToken: captchaValue,
        }),
      }
    );

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    // Always respond with a generic success message for security
    setMessage({
      type: "success",
      text: "If this email exists, a reset link has been sent.",
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error
        ? err.message
        : "Unable to send reset email. Please try again.";
    setMessage({ type: "error", text: msg });
    console.error("Recover error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen pt-20 lg:pt-30 pb-10 bg-[#f7f7fa] font-maven p-4">
      {/* ...your existing JSX... */}
      <form onSubmit={handleSubmit}>
        {/* email input */}
        <label className="text-sm font-medium block mb-2">Email Address *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[50px] p-3 border text-sm border-[#D5D2E5] border-opacity-80 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="name@example.com"
        />

        {/* captcha */}
        <div className="mb-4">
          <ReCAPTCHA
            sitekey="6LdsiPkqAAAAAKTQ0AsrTskmsAePkAUM_ZKDr1ym" // your site key
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
  );
}
