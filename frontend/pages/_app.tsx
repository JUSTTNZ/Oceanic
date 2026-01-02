// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Router } from "next/router";
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

// ✅ CRITICAL: Check IMMEDIATELY on page load
if (typeof window !== "undefined") {
  const hash = window.location.hash;
  const pathname = window.location.pathname;
  
  console.log("🚀 EARLY LOAD CHECK");
  console.log("URL:", window.location.href);
  console.log("Pathname:", pathname);
  console.log("Hash length:", hash.length);
  
  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get("type");
    const token = params.get("access_token");
    
    console.log("🔑 Access token found!");
    console.log("📋 Type:", type);
    console.log("🎯 Token exists:", !!token);
    
    // Store the original URL for debugging
    sessionStorage.setItem("debug_original_url", window.location.href);
    
    if (type === "recovery") {
      console.log("🔐🔐🔐 PASSWORD RECOVERY DETECTED 🔐🔐🔐");
      sessionStorage.setItem("password_reset_active", "true");
      sessionStorage.setItem("reset_token", token || "");
      
      // FORCE redirect to reset page if not already there
      if (!pathname.includes("/auth/reset")) {
        console.log("⚠️ Not on reset page - forcing redirect NOW");
        window.location.replace("/auth/reset" + hash);
        throw new Error("Redirecting to reset page"); // Stop all execution
      }
      console.log("✅ Already on reset page - good!");
    }
  }
}

// AppContent component that includes session monitoring
function AppContent({ Component, pageProps, router }: AppPropsWithRouter) {
  // Initialize session monitoring hooks
  useActivityTracker()
  useSessionMonitor()

  return (
    <>
      <Component {...pageProps} />
      <SessionTimeoutWarning />
      <NetworkStatusBar />
    </>
  )
}

export default function App({ Component, pageProps, router }: AppPropsWithRouter) {
  const blockRedirect = useRef(false);

  useEffect(() => {
    // Check if we're in password reset mode
    const isPasswordReset = sessionStorage.getItem("password_reset_active") === "true";
    
    if (isPasswordReset) {
      console.log("🛑 PASSWORD RESET MODE - BLOCKING ALL REDIRECTS");
      blockRedirect.current = true;
      
      // If somehow we're not on the reset page, go there
      if (router.pathname !== "/auth/reset") {
        console.log("⚠️ In reset mode but wrong page - redirecting");
        const token = sessionStorage.getItem("reset_token");
        if (token) {
          router.replace("/auth/reset#access_token=" + token + "&type=recovery");
        }
      }
      return;
    }
    
    const hash = window.location.hash;
    
    // Log every time this runs
    console.log("📍 useEffect running:", {
      pathname: router.pathname,
      hasHash: !!hash,
      blockRedirect: blockRedirect.current
    });
    
    // If blocking, don't do anything
    if (blockRedirect.current) {
      console.log("🛑 Redirect blocked");
      return;
    }
    
    // Check for magic link login
    if (hash.includes("access_token") && hash.includes("token_type=bearer")) {
      const params = new URLSearchParams(hash.substring(1));
      const type = params.get("type");
      
      console.log("🔍 Checking auth type:", type);
      
      // Final safety check for recovery
      if (type === "recovery") {
        console.log("🔐 Recovery in useEffect - activating block");
        sessionStorage.setItem("password_reset_active", "true");
        blockRedirect.current = true;
        return;
      }
      
      // Regular magic link - redirect to markets
      const hasRedirected = sessionStorage.getItem("magiclink_redirected");
      if (!hasRedirected) {
        console.log("✉️ Magic link login detected - redirecting to /markets");
        sessionStorage.setItem("magiclink_redirected", "true");
        router.replace("/markets");
      }
    }
  }, [router, router.pathname]);

  // Monitor route changes
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const isPasswordReset = sessionStorage.getItem("password_reset_active") === "true";
      
      console.log("🔄 Route change attempt:", url);
      console.log("Password reset active?", isPasswordReset);
      
      if (isPasswordReset && !url.includes("/auth/reset")) {
        console.log("🛑 BLOCKING route change during password reset!");
        // This won't actually block it in Next.js, but good to log
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  // Clear reset flag when successfully leaving reset page
  useEffect(() => {
    if (router.pathname !== "/auth/reset") {
      const wasResetting = sessionStorage.getItem("password_reset_active");
      if (wasResetting) {
        // Only clear if user navigated away intentionally (not during active reset)
        const currentUrl = window.location.href;
        if (!currentUrl.includes("access_token")) {
          console.log("✅ Left reset page - clearing flags");
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
              <AppContent Component={Component} pageProps={pageProps} router={router} key={router.route} />
              <Analytics />
            </motion.div>
          </AnimatePresence>
        </PersistGate>
      </Provider>
    </div>
  );
}