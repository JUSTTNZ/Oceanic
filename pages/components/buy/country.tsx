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
  className = ""
}: CountryDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">Country</label>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center justify-between w-full border px-4 py-3 rounded-lg text-sm hover:border-gray-400 focus:border-blue-300 focus:outline-none transition-colors"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        >
          <div className="flex items-center">
            <span className="mr-2">
              <Image 
                src={selectedCountry.flag} 
                alt={`${selectedCountry.name} flag`} 
                width={24} 
                height={16}
                className="object-contain"
              />
            </span>
            <span>{selectedCountry.name}</span>
          </div>
          <ChevronDownIcon 
            className={`h-4 w-4 ml-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>

        {showDropdown && (
          <div 
            className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide"
            role="listbox"
          >
            {countries.map((country) => (
              <button
                key={country.code}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                onClick={() => {
                  onSelect(country);
                  setShowDropdown(false);
                }}
                role="option"
                aria-selected={country.code === selectedCountry.code}
              >
                <span className="mr-2">
                  <Image 
                    src={country.flag} 
                    alt={`${country.flag} flag`} 
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