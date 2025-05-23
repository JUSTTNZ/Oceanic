import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {  useState } from "react";

interface Bank {
  name: string;
  code: string;
}

interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
}

// ...other imports
 interface BanksProps {
  bankDetails: BankDetails;
  banksList: { name: string; code: string }[];
  setBankDetails: React.Dispatch<React.SetStateAction<BankDetails>>;
  status: "pending" | "confirmed" | "failed"; // or import TransactionStatus if defined elsewhere
  bankErrors: { accountNumber?: string; accountName?: string };
  setBankErrors: React.Dispatch<
    React.SetStateAction<{
      accountNumber?: string;
      accountName?: string;
    }>
  >;
}


export default function Banks({
  banksList,
  bankDetails,
  setBankDetails,
  setBankErrors,
  bankErrors,
 
}: BanksProps) {
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const filteredBanks = banksList.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
  );

 const handleBankDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    // Validation
    if (name === "accountNumber") {
      // Only allow numbers and limit to 10 digits
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setBankDetails(prev => ({
        ...prev,
        accountNumber: numbersOnly
      }));
      
      // Validate length
      if (numbersOnly.length !== 10 && numbersOnly.length > 0) {
        setBankErrors(prev => ({
          ...prev,
          accountNumber: "Account number must be 10 digits"
        }));
      } else {
        setBankErrors(prev => ({
          ...prev,
          accountNumber: undefined
        }));
      }
    } 
 
    else {
      setBankDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  return (
    <div className={`space-y-4 `}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-100">Bank Name</label>
        <div className="relative">
          <button
            onClick={() => setShowBankDropdown(!showBankDropdown)}
            className="flex items-center justify-between w-full border border-gray-500 px-4 py-3 rounded-lg text-sm hover:border-gray-600 focus:border-blue-600 focus:outline-none transition-colors text-white"
            aria-expanded={showBankDropdown}
            aria-haspopup="listbox"
          >
            <span>{selectedBank?.name || "Select your bank"}</span>
            <ChevronDownIcon
              className={`h-4 w-4 ml-2 text-white transition-transform ${
                showBankDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showBankDropdown && (
            <div
              className="absolute z-10 mt-1 w-full bg-gray-900 text-white border border-gray-800 rounded-lg shadow-lg"
              role="listbox"
            >
              <div className="p-2 border-b border-blue-600">
                <input
                  type="text"
                  placeholder="Search banks..."
                  className="w-full px-3 py-2 text-sm border rounded-md focus:border-blue-600 focus:outline-none"
                  value={bankSearchTerm}
                  onChange={(e) => setBankSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto scrollbar-hide">
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <button
                      key={bank.code}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
                      onClick={() => {
                        setBankDetails((prev) => ({
                          ...prev,
                          bankName: bank.name,
                          bankCode: bank.code,
                        }));
                        setSelectedBank(bank);
                        setShowBankDropdown(false);
                        setBankSearchTerm("");
                      }}
                      role="option"
                      aria-selected={bank.name === selectedBank?.name}
                    >
                      {bank.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-100">
                    No banks found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="accountNumber"
          className="block text-sm font-medium text-gray-100 mb-1"
        >
          Account Number
        </label>
        <input
          type="text"
          id="accountNumber"
          name="accountNumber"
          value={bankDetails.accountNumber}
          onChange={handleBankDetailsChange}
          placeholder="1234567890"
          className="w-full border border-gray-500 px-4 py-2 rounded-lg text-white text-md font-medium focus:border-blue-600 focus:outline-none"
          // disabled={status !== "pending"}
        />
           {bankErrors.accountNumber && (
          <p className="text-sm text-red-400 mt-1">{bankErrors.accountNumber}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="accountName"
          className="block text-sm font-medium text-gray-100 mb-1"
        >
          Account Name
        </label>
        <input
          type="text"
          id="accountName"
          name="accountName"
          value={bankDetails.accountName}
          onChange={handleBankDetailsChange}
          placeholder="John Doe"
          className="w-full border border-gray-500 px-4 py-2 rounded-lg text-white text-md font-medium focus:border-blue-600 focus:outline-none"
          // disabled={status !== "pending"}
        />
           {bankErrors.accountName && (
          <p className="text-sm text-red-400 mt-1">{bankErrors.accountName}</p>
        )}
      </div>
    </div>
  );
}

