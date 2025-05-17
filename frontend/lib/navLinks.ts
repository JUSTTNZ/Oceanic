import {
  CreditCardIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  Squares2X2Icon,
  UsersIcon,
  BookOpenIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export const megaMenus = {
  Trade: [
    { icon: CreditCardIcon, title: "Cards", desc: "Spend money globally with a card that does it all.", href: "trades/cards" },
    { icon: RocketLaunchIcon, title: "Instant Swap", desc: "Buy your favourite cryptocurrency in 2 mins or less.", href: "trades/instant-swap" },
    { icon: LockClosedIcon, title: "Buy/Sell", desc: "Trade cryptocurrencies instantly with deep liquidity and competitive rates.", href: "trades/buy-sell" },
    { icon: Squares2X2Icon, title: "P2P", desc: "Securely buy and sell crypto directly with other users.", href: "trades/p2p" },
  ],
  Resources: [
    { icon: UsersIcon, title: "Community", desc: "Connect with other traders and stay updated on the latest trends.", href: "resources/community" },
    { icon: RocketLaunchIcon, title: "Tutorials", desc: "Step-by-step guides to help you navigate crypto trading with ease.", href: "resources/tutorial" },
    { icon: BookOpenIcon, title: "Docs", desc: "Comprehensive technical documentation for developers and traders.", href: "resources/docs" },
  ],
  Company: [
    { icon: BriefcaseIcon, title: "About Us", desc: "Learn more about Oceanic and our mission to revolutionize trading.", href: "company/about" },
    { icon: BookOpenIcon, title: "Careers", desc: "Join our team and build a future in the world of crypto and finance.", href: "company/career" },
    { icon: RocketLaunchIcon, title: "Blog", desc: "Stay informed with the latest news, insights, and market trends.", href: "company/blog" },
  ],
};
