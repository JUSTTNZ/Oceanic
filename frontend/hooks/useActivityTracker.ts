import { useEffect, useCallback, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { apiClients } from "@/lib/apiClient";

const ACTIVITY_DEBOUNCE_MS = 1_000;
const MIN_UPDATE_INTERVAL_MS = 60_000; // Don't ping more than once per minute

export function useActivityTracker() {
  const lastActivityRef = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen to auth state so we only track activity when logged in
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data?.session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateActivity = useCallback(async () => {
    if (!isAuthenticated) return;

    const now = Date.now();
    if (now - lastActivityRef.current < MIN_UPDATE_INTERVAL_MS) return;

    try {
      await apiClients.request("/api/v1/auth/activity", { method: "PATCH" });
      lastActivityRef.current = now;
    } catch {
      // Activity updates are non-critical — swallow errors
    }
  }, [isAuthenticated]);

  const debouncedUpdate = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(updateActivity, ACTIVITY_DEBOUNCE_MS);
  }, [updateActivity]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousedown", "keypress", "scroll", "touchstart"] as const;
    const handler = () => debouncedUpdate();

    events.forEach((e) => document.addEventListener(e, handler, true));

    return () => {
      events.forEach((e) => document.removeEventListener(e, handler, true));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [debouncedUpdate, isAuthenticated]);

  return { updateActivity };
}
