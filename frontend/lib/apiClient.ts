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

export const apiClients = {
  async request(input: string, init: RequestInitLike = {}) {
    // allow unauthenticated calls by passing { skipAuth: true }
    const headers = new Headers(init.headers || {});
    if (!init.skipAuth) {
      const token = await getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        // No token ->  throw so caller can route to /login
        throw new Error("No access token");
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
    if (response.status === 401) {
      try {
        const errorData = await response.clone().json();
        const reason = errorData?.reason;

        if (reason === 'idle_timeout' || reason === 'absolute_timeout') {
          console.warn(`🚪 Session timeout detected: ${reason}`);
          // Sign out and redirect to login with reason
          await supabase.auth.signOut();
          window.location.href = `/login?reason=${reason === 'idle_timeout' ? 'timeout' : 'expired'}`;
          return response; // Return original response to prevent further processing
        }
      } catch (e) {
        // If we can't parse the error, continue with normal flow
        console.warn('Could not parse 401 error response:', e);
      }
    }

    return response;
  },
};
