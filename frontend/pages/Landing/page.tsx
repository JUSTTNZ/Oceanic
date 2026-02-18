import Navbar from "./navbar";
import Hero from "./hero";
import StatsSection from "./stats";
import CoinLive from "./coinprice";
import WhyOceanic from "./whyoceanic";
import HowItWorks from "./howitworks";
import TestimonialSection from "./testmonial";
import CTASection from "./cta";
import Footer from "./footer";

interface LandingProps {
  coins: Coin[];
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  sparkline_in_7d: {
    price: number[];
  };
}

function SectionDivider() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

export default function Landing({ coins }: LandingProps) {
  return (
    <div className="landing-dark-bg min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <SectionDivider />
      <StatsSection />
      <SectionDivider />
      <CoinLive coins={coins} />
      <SectionDivider />
      <WhyOceanic />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
