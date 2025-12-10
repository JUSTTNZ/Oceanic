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
import { useEffect } from "react";

import { Toaster } from "react-hot-toast"; // ✅ Import toast

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // This effect runs on the client-side after hydration
    const hash = window.location.hash;
    // Check if the URL hash contains magic link auth information
    if (hash.includes("access_token") && hash.includes("token_type=bearer")) {
      // Check a session flag to prevent redirect loops
      const hasRedirected = sessionStorage.getItem("magiclink_redirected");
      if (!hasRedirected) {
        // Set the flag and redirect to the desired page
        sessionStorage.setItem("magiclink_redirected", "true");
        router.replace("/markets");
      }
    }
  }, [router]);


  return (
    <div className={inter.className}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.route}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* ✅ Add Toaster here */}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    padding: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    borderRadius: "8px",
                  },
                  success: {
                    style: {
                      background: "#DBEAFE",       // light blue background
                      color: "#1E3A8A",            // deep blue text
                      borderLeft: "6px solid #3B82F6", // bright blue accent border
                    },
                  },
                  error: {
                    style: {
                      background: "#fee2e2",
                      color: "#991b1b",
                      borderLeft: "6px solid #ef4444",
                    },
                  },
                }}
              />
              <Component {...pageProps} key={router.route} />
              <Analytics />
            </motion.div>
          </AnimatePresence>
        </PersistGate>
      </Provider>
    </div>
  );
}
