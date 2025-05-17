// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import { Analytics } from "@vercel/analytics/react";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  const route = useRouter();

  return (
    <div className={inter.className}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={route.route}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Component {...pageProps} key={route.route} />
              <Analytics />
            </motion.div>
          </AnimatePresence>
        </PersistGate>
      </Provider>
    </div>
  );
}
