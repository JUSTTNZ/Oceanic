import { Analytics } from "@vercel/analytics/next"
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {store,persistor } from  '../store'
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // This creates a CSS variable
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    

    <div className={inter.className}>
          <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
       <Component {...pageProps} />
       <Analytics />
       </PersistGate>
       </Provider>
       </div>
    
  )
}
