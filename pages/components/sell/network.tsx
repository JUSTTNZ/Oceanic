interface Coin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
  }
interface NetworkWarningProps {
  selectedCoin: Coin | null;
}

export default function NetworkWarning({ selectedCoin }: NetworkWarningProps) {
  if (!selectedCoin) return null;

  return (
    <div className="p-3 bg-yellow-50 rounded-lg text-yellow-700 text-xs">
      <p className="font-medium">Important:</p>
      <p>
        Ensure you&apos;re sending {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()}) on the correct network.
        Sending on wrong networks may result in permanent loss.
      </p>
    </div>
  );
}