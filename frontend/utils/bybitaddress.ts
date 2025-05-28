interface WalletAddress {
  address: string;
  network: string;
  note?: string;
}

export const BYBIT_WALLET_ADDRESSES: Record<string, WalletAddress[]> = {
  USDT: [
    {
      address: "TGNsXRxzAXs7xh4fBs7sQVjhej9JnKcvfU",
      network: "TRC20",
      note: "USDT TRC20 wallet address"
    }
  ],
  BTC: [
    {
      address: "1QBbNxYLTAUPNHeQeU6aeEivz6mbVBdiT7",
      network: "BTC",
      note: "Bybit BTC wallet address"
    }
  ],
  ETH: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "Ethereum Mainnet",
      note: "Ethereum Mainnet wallet address"
    },
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "Base",
      note: "Ethereum Base wallet address"
    }
  ],
  BNB: [
    {
      address: "CNPyBk7Zqvn52qRg1w9CcnbwpkBr8LQ9KLwYUhWMBbQU",
      network: "BEP20",
      note: "BNB BEP20 wallet address"
    }
  ],
  SOL: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "SOL",
      note: "Solana wallet address"
    }
  ],
  XRP: [
    {
      address: "rGDreBvnHrX1get7na3J4oowN19ny4GzFn",
      network: "XRP",
      note: "XRP wallet address, Tag/memo: 451786069"
    }
  ],
  ADA: [
    {
      address: "2a60aae0aedffc89d5b0ef571af7b7937e58d494251c5a0da535a91dcb0d23f9",
      network: "ADA",
      note: "Cardano wallet address"
    }
  ],
  DOGE: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "DOGE",
      note: "Doge wallet address"
    }
  ],
  DOT: [
    {
      address: "14ErftuTiyBi2LqCHNfX1LpbMfW6Y2VtKMRuhV2zNHff5D2W",
      network: "DOT"
    }
  ],
  MATIC: [
    {
      address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      network: "MATIC"
    }
  ],
  USDC: [
    {
      address: "0x4532fe9d370b19dd1bba5fd324e4b022a85a5345",
      network: "BEP20",
      note: "USDC BEP20 wallet address"
    },
    {
      address: "D8ZR94qAgK4Hgj75Zhs352ztCr1QEtX98P",
      network: "ERC20",
      note: "USDC ERC20 wallet address"
    }
  ],
  AVAX: [
    {
      address: "X-avax1deqsna9u4jy38squh65twvy68d7rcjpnntvcua",
      network: "C-Chain",
      note: "AVAX C-Chain wallet address"
    },
    {
      address: "Ae2tdPwUPEZ9nvdiZoMJEPXx5Lmwfy1AQrUBmtofAhPSYRgmtm6rAb4WNuR",
      network: "X-Chain",
      note: "AVAX X-Chain wallet address"
    }
  ],
  NEAR: [
    {
      address: "2a60aae0aedffc89d5b0ef571af7b7937e58d494251c5a0da535a91dcb0d23f9",
      network: "Near (Near protocol) wallet address"
    }
  ]
};