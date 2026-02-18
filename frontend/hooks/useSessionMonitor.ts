import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { apiClients } from "@/lib/apiClient";

export interface SessionState {
  isWarning: boolean;
  countdown: number;
  reason: "idle_timeout" | "absolute_timeout" | null;
}

const WARNING_TIME_SECONDS = 2 * 60; // 2 minutes
const CHECK_INTERVAL_MS = 60_000; // 1 minute

// Pages where session monitoring should NOT run
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/resetpassword",
  "/auth/reset",
  "/company/about",
  "/company/blog",
  "/company/career",
  "/resources/community",
  "/resources/docs",
  "/resources/tutorial",
  "/trades/buyandsell",
  "/trades/instant-swap",
  "/trades/p2p",
  "/trades/cards",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function useSessionMonitor() {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>({
    isWarning: false,
    countdown: WARNING_TIME_SECONDS,
    reason: null,
  });

  // Track whether user is authenticated so we can skip polling on public pages
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Listen for Supabase auth state changes to know when user logs in/out
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    // Also check once on mount
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data?.session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = useCallback(async () => {
    // Don't check on public routes or when not authenticated
    if (isPublicRoute(router.pathname) || !isAuthenticated) return;

    try {
      const response = await apiClients.request("/api/v1/users/current", {
        method: "GET",
      });

      if (response.ok) {
        // Session is valid — clear any warning
        setSessionState({
          isWarning: false,
          countdown: WARNING_TIME_SECONDS,
          reason: null,
        });
      } else if (response.status === 401) {
        // Try to parse the reason from the backend
        let reason: string | null = null;
        try {
          const body = await response.json();
          reason = body?.reason ?? null;
        } catch {
          // ignore parse errors
        }

        if (reason === "idle_timeout" || reason === "absolute_timeout") {
          setSessionState({
            isWarning: true,
            countdown: WARNING_TIME_SECONDS,
            reason,
          });
        } else {
          // Generic 401 (token expired, invalid, etc.) — sign out quietly
          await supabase.auth.signOut();
          router.push("/login?reason=expired");
        }
      }
    } catch {
      // Network error — don't redirect, just wait for next check
    }
  }, [router, isAuthenticated]);

  // Periodic session check — only when authenticated and on a protected route
  useEffect(() => {
    if (!isAuthenticated || isPublicRoute(router.pathname)) {
      // Clear any running interval if user navigates to public page
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial check
    checkSession();

    intervalRef.current = setInterval(checkSession, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkSession, isAuthenticated, router.pathname]);

  // Countdown timer — only runs when warning is active
  useEffect(() => {
    if (!sessionState.isWarning) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      return;
    }

    countdownRef.current = setInterval(() => {
      setSessionState((prev) => {
        if (prev.countdown <= 1) {
          // Time's up — sign out
          supabase.auth.signOut();
          router.push("/login?reason=expired");
          return prev;
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [sessionState.isWarning, router]);

  // "Stay Logged In" handler — pings activity endpoint to reset backend idle timer
  const stayLoggedIn = useCallback(async () => {
    try {
      const res = await apiClients.request("/api/v1/auth/activity", {
        method: "PATCH",
      });

      if (res.ok) {
        setSessionState({
          isWarning: false,
          countdown: WARNING_TIME_SECONDS,
          reason: null,
        });
      } else {
        // Refresh failed — log out
        await supabase.auth.signOut();
        router.push("/login?reason=expired");
      }
    } catch {
      await supabase.auth.signOut();
      router.push("/login?reason=expired");
    }
  }, [router]);

  return { sessionState, stayLoggedIn };
}
