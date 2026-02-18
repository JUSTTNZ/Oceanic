// utils/apiClient.ts
import { supabase } from "@/lib/supabase";

type RequestInitLike = RequestInit & { skipAuth?: boolean };

async function getAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn("getSession error:", error.message);
    return null;
  }
  return data?.session?.access_token ?? null;
}

// Track if a redirect is already in progress to prevent duplicate redirects
let isRedirecting = false;

export const apiClients = {
  async request(input: string, init: RequestInitLike = {}) {
    const headers = new Headers(init.headers || {});

    if (!init.skipAuth) {
      const token = await getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        // No token — return a synthetic 401 response instead of throwing.
        // This lets callers handle it gracefully (e.g. session monitor
        // simply stops polling) rather than crashing with an unhandled error.
        return new Response(JSON.stringify({ error: "No access token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Always send JSON unless caller overrides
    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(input, {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    });

    // Global 401 interceptor for session timeouts
    if (response.status === 401 && !isRedirecting) {
      try {
        const errorData = await response.clone().json();
        const reason = errorData?.reason;

        if (reason === "idle_timeout" || reason === "absolute_timeout") {
          isRedirecting = true;
          await supabase.auth.signOut();
          window.location.href = `/login?reason=${reason === "idle_timeout" ? "timeout" : "expired"}`;
          return response;
        }
      } catch {
        // If we can't parse the error body, continue with normal flow
      }
    }

    return response;
  },
};
