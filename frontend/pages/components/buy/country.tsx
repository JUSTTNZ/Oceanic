import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";

interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

interface CountryDropdownProps {
  countries: Country[];
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  className?: string;
}

export default function CountryDropdown({
  countries,
  selectedCountry,
  onSelect,
  className = "",
}: CountryDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Fallback for undefined selectedCountry
  const safeSelectedCountry = selectedCountry || {
    code: "",
    name: "Select a country",
    flag: "/default-flag.png", // Provide a default flag
    currency: "",
    currencySymbol: "",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-100">Country</label>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center justify-between w-full border border-gray-500 px-4 py-3 rounded-lg text-sm hover:border-blue-600 focus:border-blue-600 focus:outline-none transition-colors"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        >
          <div className="flex items-center text-white">
            <span className="mr-2">
              <Image 
                src={safeSelectedCountry.flag} 
                alt={`${safeSelectedCountry.name} flag`} 
                width={24} 
                height={16}
                className="object-contain"
              />
            </span>
            <span>{safeSelectedCountry.name}</span>
          </div>
          <ChevronDownIcon 
            className={`h-4 w-4 ml-2 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>

        {showDropdown && (
          <div 
            className="absolute z-20 mt-1 w-full bg-gray-900 text-white border border-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide"
            role="listbox"
          >
            {countries.map((country) => (
              <button
                key={country.code}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-800 text-left"
                onClick={() => {
                  onSelect(country);
                  setShowDropdown(false);
                }}
                role="option"
                aria-selected={country.code === safeSelectedCountry.code}
              >
                <span className="mr-2">
                  <Image 
                    src={country.flag} 
                    alt={`${country.name} flag`} 
                    width={24} 
                    height={16}
                    className="object-contain"
                  />
                </span>
                {country.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
