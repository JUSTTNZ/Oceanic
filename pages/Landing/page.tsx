// /src/components/Landing.tsx
import Navbar from "./navbar";
import Hero from "./hero";
import CoinLive from "./coinprice";
import Footer from "./footer";

interface LandingProps {
  coins: Coin[];
}

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  sparkline_in_7d: {
    price: number[];
  };
};

export default function Landing({ coins }: LandingProps) {
  return (
    <div>
      <Navbar />
      <Hero />
      <CoinLive coins={coins} />
      <Footer />
    </div>
  );
}
