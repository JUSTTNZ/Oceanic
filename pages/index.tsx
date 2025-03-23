import Landing from "./Landing/page";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
}

export default function Home({ coins }: { coins: Coin[] }) {
  return <Landing coins={coins} />;
}

export async function getServerSideProps() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true');
    const coins = await res.json();

    // Validate that coins is actually an array
    if (!Array.isArray(coins)) {
      throw new Error('Coins data is not an array');
    }

    return { props: { coins } };
  } catch (error) {
    console.error("Error fetching coins:", error);
    return { props: { coins: [] } }; // fallback to empty array
  }
}

