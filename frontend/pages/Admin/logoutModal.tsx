
interface LogoutProps {
    showModal: boolean;
    setShowModal: () => void;
  }

export default function LogoutModal ({ setShowModal}:LogoutProps) {
    const handleSignOut = async () => {
  
    };
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
          <p className="text-sm text-gray-100 mb-6">Are you sure you want to sign out?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={setShowModal}
              className="px-4 py-2 rounded bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
}