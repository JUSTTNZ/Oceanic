
interface AmountInputProps {
  amount: number;
  setAmount: (value: number) => void;
  status:string
 
}

export default function AmountInputSell({
 
  amount,
  setAmount,


}: AmountInputProps) {




 

  return (
    <div className={`space-y-2 `}>
      <label className="text-sm font-medium text-gray-100">
        Amount in 
      </label>
      <input
        type="number"
        placeholder="Enter amount"
        className="border border-gray-500 px-4 py-3 rounded-lg w-full text-white  text-sm font-medium 
                   focus:border-blue-600 focus:outline-none"
        value={amount}
        required
     onChange={(e) => setAmount(parseFloat(e.target.value))} 
        inputMode="decimal"
      />
    </div>
  );
}
