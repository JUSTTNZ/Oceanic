import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // This creates a CSS variable
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
       <Component {...pageProps} />
       </div>
  )
}
