// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";
import { Inter } from "next/font/google";

type AppPropsWithRouter = AppProps & {
  router: Router;
};
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import { Analytics } from "@vercel/analytics/react";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { Toaster } from "react-hot-toast";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { useSessionMonitor } from "@/hooks/useSessionMonitor";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";
import NetworkStatusBar from "@/components/NetworkStatusBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/resetpassword',
  '/auth/callback',
  '/auth/reset',
  '/Landing',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
}

// Handle password recovery redirect before React hydrates
if (typeof window !== "undefined") {
  const hash = window.location.hash;
  const pathname = window.location.pathname;

  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get("type");
    const token = params.get("access_token");

    if (type === "recovery") {
      sessionStorage.setItem("password_reset_active", "true");
      sessionStorage.setItem("reset_token", token || "");

      if (!pathname.includes("/auth/reset")) {
        window.location.replace("/auth/reset" + hash);
      }
    }
  }
}

// Only runs session hooks on protected routes
function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const onProtectedRoute = !isPublicRoute(router.pathname)

  useActivityTracker()
  useSessionMonitor()

  return (
    <>
      {children}
      {onProtectedRoute && <SessionTimeoutWarning />}
    </>
  )
}

export default function App({ Component, pageProps, router }: AppPropsWithRouter) {
  const blockRedirect = useRef(false);

  useEffect(() => {
    const isPasswordReset = sessionStorage.getItem("password_reset_active") === "true";

    if (isPasswordReset) {
      blockRedirect.current = true;

      if (router.pathname !== "/auth/reset") {
        const token = sessionStorage.getItem("reset_token");
        if (token) {
          router.replace("/auth/reset#access_token=" + token + "&type=recovery");
        }
      }
      return;
    }

    const hash = window.location.hash;

    if (blockRedirect.current) return;

    // Check for magic link login (not recovery)
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

  // Clear reset flags when navigating away from reset page
  useEffect(() => {
    if (router.pathname !== "/auth/reset") {
      const wasResetting = sessionStorage.getItem("password_reset_active");
      if (wasResetting) {
        const currentUrl = window.location.href;
        if (!currentUrl.includes("access_token")) {
          sessionStorage.removeItem("password_reset_active");
          sessionStorage.removeItem("reset_token");
          sessionStorage.removeItem("magiclink_redirected");
          blockRedirect.current = false;
        }
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
              <NetworkStatusBar />
              <Analytics />
            </motion.div>
          </AnimatePresence>
        </PersistGate>
      </Provider>
    </div>
  );
}
