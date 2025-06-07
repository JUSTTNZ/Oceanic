// apiClient.ts

import { store } from "@/store";


// Add this interface to describe your Redux state shape
interface RootState {
  auth: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    } | null;
  };
}

export const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    const state = store.getState() as unknown as RootState; // Cast to RootState
    const accessToken = state.auth?.tokens?.accessToken;

    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401) {
      // Add token refresh logic here
    }

    return response;
  },
};