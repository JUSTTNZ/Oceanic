
type TransactionStatus = 'pending' | 'sent' | 'received' | 'completed' | 'failed';

interface TxidInputProps {
  txid: string;
  setTxid: (value: string) => void;
  status: TransactionStatus;
}

export default function TxidInput({ txid, setTxid, status }: TxidInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="txid" className="text-sm font-medium text-gray-700">
        Transaction ID (TXID)
      </label>
      <input
        id="txid"
        type="text"
        placeholder="Paste your transaction hash here"
        className="border px-4 py-3 rounded-lg w-full text-sm focus:border-blue-300 focus:outline-none"
        value={txid}
        onChange={(e) => setTxid(e.target.value)}
        disabled={status !== 'pending'}
      />
      <p className="text-xs text-gray-500">
        Find this in your wallet&apos;s transaction history after sending
      </p>
    </div>
  );
}