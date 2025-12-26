interface WalletAddress {
  address: string;
  network: string;
  memo?: string;
  note?: string;
}

export const BYBIT_WALLET_ADDRESSES: Record<string, WalletAddress[]> = {
  BTC: [
    {
      address: "1QBbNxYLTAUPNHeQeU6aeEivz6mbVBdiT7",
      network: "Bitcoin",
      note: "Bitcoin (BTC) wallet address"
    }
  ],

  ETH: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "Ethereum Mainnet (ERC20)",
      note: "ETH Mainnet wallet address"
    },
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "Base",
      note: "Base network wallet address (ETH-compatible)"
    }
  ],

  USDT: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "BEP20",
      note: "USDT BEP20 wallet address"
    },
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "ERC20",
      note: "USDT ERC20 wallet address"
    },
    {
      address: "TGNsXRxzAXs7xh4fBs7sQVjhej9JnKcvfU",
      network: "TRC20",
      note: "USDT TRC20 wallet address"
    }
  ],

  BNB: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "BEP20 / BSC",
      note: "Binance Smart Chain wallet address"
    }
  ],

  XRP: [
    {
      address: "rGDreBvnHrX1get7na3J4oowN19ny4GzFn",
      network: "XRP",
      memo: "451786069",
      note: "XRP wallet address with required tag/memo"
    }
  ],

  USDC: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "BEP20",
      note: "USDC BEP20 wallet address"
    },
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "ERC20",
      note: "USDC ERC20 wallet address"
    },
    {
      address: "CNPyBk7Zqvn52qRg1w9CcnbwpkBr8LQ9KLwYUhWMBbQU",
      network: "Solana",
      note: "USDC Solana wallet address"
    }
  ],

  SOL: [
    {
      address: "CNPyBk7Zqvn52qRg1w9CcnbwpkBr8LQ9KLwYUhWMBbQU",
      network: "Solana",
      note: "Solana (SOL) wallet address"
    }
  ],

  DOGE: [
    {
      address: "D8ZR94qAgK4Hgj75Zhs352ztCr1QEtX98P",
      network: "Dogecoin",
      note: "Dogecoin (DOGE) wallet address"
    }
  ],

  ADA: [
    {
      address: "Ae2tdPwUPEZ9nvdiZoMJEPXx5Lmwfy1AQrUBmtofAhPSYRgmtm6rAb4WNuR",
      network: "Cardano",
      note: "Cardano (ADA) wallet address"
    }
  ],

  AVAX: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "Avalanche C-Chain",
      note: "AVAX C-Chain wallet address"
    }
  ],

  SUI: [
    {
      address: "0xab89fe2a83790aad2c8e10f2c95a000895706799bc8f084ace9596230666997c",
      network: "Sui",
      note: "Sui (SUI) wallet address"
    }
  ],

  LTC: [
    {
      address: "Ld6mqvFbtgug1L8vV5A9MG98YrkT4ezGPF",
      network: "Litecoin",
      note: "Litecoin (LTC) wallet address"
    }
  ],

  SHIB: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "BEP20",
      note: "Shiba Inu BEP20 wallet address"
    },
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "ERC20",
      note: "Shiba Inu ERC20 wallet address"
    }
  ],

  PI: [
    {
      address: "MDFNWH6ZFJVHJDLBMNOUT35X4EEKQVJAO3ZDL4NL7VQJLC4PJOQFWAAAAAAO4ZYL4SD7O",
      network: "Pi Network",
      note: "Pi Network (PI) wallet address"
    }
  ],

  JUP: [
    {
      address: "CNPyBk7Zqvn52qRg1w9CcnbwpkBr8LQ9KLwYUhWMBbQU",
      network: "Solana",
      note: "Jupiter (JUP) Solana wallet address"
    }
  ],

  TON: [
    {
      address: "UQANseOk2PMFG9E5z8_BPJ_5s62v8jPjn1YPzyUTcl8i1NS8",
      network: "TON",
      note: "The Open Network (TON) wallet address"
    }
  ],

  ARB: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "Arbitrum One",
      note: "Arbitrum (ARB) wallet address"
    }
  ],

  LINK: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "ERC20",
      note: "Chainlink (LINK) ERC20 wallet address"
    }
  ]
};

export const COIN_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether",
  BNB: "Binance Coin",
  XRP: "Ripple",
  USDC: "USD Coin",
  SOL: "Solana",
  DOGE: "Dogecoin",
  ADA: "Cardano",
  AVAX: "Avalanche",
  SUI: "Sui",
  LTC: "Litecoin",
  SHIB: "Shiba Inu",
  PI: "Pi Network",
  JUP: "Jupiter",
  TON: "Toncoin",
  ARB: "Arbitrum",
  LINK: "Chainlink"
};
