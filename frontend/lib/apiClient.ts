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
    let headers = new Headers(init.headers || {});
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

    return fetch(input, {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    });
  },
};
