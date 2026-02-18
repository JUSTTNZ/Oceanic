import React from "react";
import type { SessionState } from "@/hooks/useSessionMonitor";

interface Props {
  sessionState: SessionState;
  stayLoggedIn: () => void;
}

export default function SessionTimeoutWarning({ sessionState, stayLoggedIn }: Props) {
  if (!sessionState.isWarning) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMessage = () => {
    if (sessionState.reason === "idle_timeout") {
      return "Your session will expire due to inactivity.";
    }
    if (sessionState.reason === "absolute_timeout") {
      return "Your session has reached the maximum duration.";
    }
    return "Your session is about to expire.";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Session Timeout Warning
            </h3>
            <p className="text-gray-300 mb-4">{getMessage()}</p>
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="text-2xl font-mono font-bold text-yellow-400">
                {formatTime(sessionState.countdown)}
              </div>
              <div className="text-sm text-gray-400 mt-1">Time remaining</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={stayLoggedIn}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Stay Logged In
            </button>
            <button
              onClick={() => (window.location.href = "/login?reason=expired")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
