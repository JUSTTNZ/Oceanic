interface WalletProps {
  walletAddress: string;
  setWalletAddress: (value: string) => void;
}

export default function WalletAddressBuy({
  walletAddress,
  setWalletAddress,
}: WalletProps) {

  const isValidAddress = (address: string) => {
   
    return address.length >= 5 ;
  };

  const isError = walletAddress && !isValidAddress(walletAddress);

  return (
    <div className={`space-y-2`}>
      <label className="text-sm font-medium text-gray-100">
        Wallet Address
      </label>
      <input
        className={`border px-4 py-3 rounded-lg w-full text-white text-sm font-medium 
                   focus:outline-none ${
                     isError
                       ? "border-red-500 focus:border-red-500"
                       : "border-gray-500 focus:border-blue-600"
                   }`}
        placeholder="Your wallet address (e.g., 0x...)"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        required
      />
      {isError && (
        <p className="text-red-500 text-xs mt-1">
          Please enter a valid wallet address 
        </p>
      )}
    </div>
  );
}