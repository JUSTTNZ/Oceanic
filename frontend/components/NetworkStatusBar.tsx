import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { useEffect, useState } from 'react'

export default function NetworkStatusBar() {
  const status = useNetworkStatus()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(status.showMessage)
  }, [status.showMessage])

  const isOnline = status.isOnline

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}
      `}
    >
      <div
        className={`
          rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg whitespace-nowrap text-sm
          ${
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }
        `}
      >
        {/* Status icon */}
        {isOnline ? (
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}

        {/* Status message */}
        <span className="font-medium">{status.lastMessage}</span>
      </div>
    </div>
  )
}
