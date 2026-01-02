export default function ErrorDisplay({ message = "Failed to load data" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Error card */}
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Error icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg animate-pulse"></div>
              <div className="relative w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border-2 border-red-500/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Error content */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We couldn't load the exchange rates. This is usually a temporary issue.
            </p>

            {/* Error message details */}
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-300 text-xs font-mono break-words">
                {message || "Failed to fetch exchange rates from server"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20"
            >
              Try Again
            </button>

            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-all duration-200 border border-slate-600/50"
            >
              Go Back
            </button>
          </div>

          {/* Help text */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-slate-400 text-xs text-center">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}