
type TransactionStatus = 'pending' | 'sent' | 'received' | 'confirmed' | 'failed' | "txid-exists";

interface TxidInputProps {
  txid: string;
  setTxid: (value: string) => void;
  status: TransactionStatus;
}

export default function TxidInput({ txid, setTxid, }: TxidInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="txid" className="text-sm font-medium text-gray-100">
        Transaction ID (TXID)
      </label>
      <input
        id="txid"
        type="text"
        placeholder="Paste your transaction hash here"
        className="border border-gray-500 text-white px-4 py-3 rounded-lg w-full text-sm focus:border-blue-600 focus:outline-none"
        value={txid}
        onChange={(e) => setTxid(e.target.value)}
        // disabled={status !== 'pending'}
      />
      <p className="text-xs text-gray-100">
        Find this in your wallet&apos;s transaction history after sending
      </p>
    </div>
  );
}