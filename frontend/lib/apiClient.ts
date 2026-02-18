import { supabase } from "@/lib/supabase";

type RequestInitLike = RequestInit & { skipAuth?: boolean };

async function getAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn("getSession error:", error.message);
    return null;
  }

  if (data?.session?.access_token) {
    return data.session.access_token;
  }

  // Session might be expired - try refreshing it
  const { data: refreshData, error: refreshError } =
    await supabase.auth.refreshSession();
  if (refreshError) {
    console.warn("refreshSession error:", refreshError.message);
    return null;
  }

  return refreshData?.session?.access_token ?? null;
}

export const apiClients = {
  async request(input: string, init: RequestInitLike = {}) {
    const headers = new Headers(init.headers || {});
    if (!init.skipAuth) {
      const token = await getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        throw new Error("No access token");
      }
    }

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

        if (reason === "idle_timeout" || reason === "absolute_timeout") {
          console.warn(`Session timeout detected: ${reason}`);
          await supabase.auth.signOut();
          window.location.href = `/login?reason=${reason === "idle_timeout" ? "timeout" : "expired"}`;
          return response;
        }
      } catch (e) {
        console.warn("Could not parse 401 error response:", e);
      }
    }

    return response;
  },
};
