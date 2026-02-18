// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Router } from "next/router";

type AppPropsWithRouter = AppProps & {
  router: Router;
};
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import { Analytics } from "@vercel/analytics/react";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";

import { Toaster } from "react-hot-toast";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { useSessionMonitor } from "@/hooks/useSessionMonitor";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";
import NetworkStatusBar from "@/components/NetworkStatusBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Handle password-recovery deep links before React mounts
if (typeof window !== "undefined") {
  const hash = window.location.hash;
  const pathname = window.location.pathname;

  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get("type");

    if (type === "recovery") {
      sessionStorage.setItem("password_reset_active", "true");
      sessionStorage.setItem("reset_token", params.get("access_token") || "");

      if (!pathname.includes("/auth/reset")) {
        window.location.replace("/auth/reset" + hash);
      }
    }
  }
}

// Single AppContent — one useSessionMonitor, one useActivityTracker
function AppContent({ Component, pageProps, router }: AppPropsWithRouter) {
  useActivityTracker();
  const { sessionState, stayLoggedIn } = useSessionMonitor();

  return (
    <>
      <Component {...pageProps} />
      <SessionTimeoutWarning
        sessionState={sessionState}
        stayLoggedIn={stayLoggedIn}
      />
      <NetworkStatusBar />
    </>
  );
}

export default function App({ Component, pageProps, router }: AppPropsWithRouter) {
  const blockRedirect = useRef(false);

  // Password reset flow
  useEffect(() => {
    const isPasswordReset =
      sessionStorage.getItem("password_reset_active") === "true";

    if (isPasswordReset) {
      blockRedirect.current = true;

      if (router.pathname !== "/auth/reset") {
        const token = sessionStorage.getItem("reset_token");
        if (token) {
          router.replace(
            "/auth/reset#access_token=" + token + "&type=recovery"
          );
        }
      }
      return;
    }

    if (blockRedirect.current) return;

    // Magic link login detection
    const hash = window.location.hash;
    if (hash.includes("access_token") && hash.includes("token_type=bearer")) {
      const params = new URLSearchParams(hash.substring(1));
      const type = params.get("type");

      if (type === "recovery") {
        sessionStorage.setItem("password_reset_active", "true");
        blockRedirect.current = true;
        return;
      }

      const hasRedirected = sessionStorage.getItem("magiclink_redirected");
      if (!hasRedirected) {
        sessionStorage.setItem("magiclink_redirected", "true");
        router.replace("/markets");
      }
    }
  }, [router, router.pathname]);

  // Clear reset flags when leaving the reset page
  useEffect(() => {
    if (router.pathname !== "/auth/reset") {
      const wasResetting = sessionStorage.getItem("password_reset_active");
      if (wasResetting && !window.location.href.includes("access_token")) {
        sessionStorage.removeItem("password_reset_active");
        sessionStorage.removeItem("reset_token");
        sessionStorage.removeItem("magiclink_redirected");
        blockRedirect.current = false;
      }
    }
  }, [router.pathname]);

  return (
    <div className={inter.className}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.route}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
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
                      background: "#DBEAFE",
                      color: "#1E3A8A",
                      borderLeft: "6px solid #3B82F6",
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
              <AppContent
                Component={Component}
                pageProps={pageProps}
                router={router}
                key={router.route}
              />
              <Analytics />
            </motion.div>
          </AnimatePresence>
        </PersistGate>
      </Provider>
    </div>
  );
}
