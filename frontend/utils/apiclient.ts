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
//        try {
//     // Attempt to refresh tokens
//     const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh`, {
//       method: 'POST',
//       credentials: 'include'
//     });
    
//     if (refreshResponse.ok) {
//       // Retry original request
//       return apiClient.request(url, options);
//     } else {
//       // Force logout if refresh fails
//       store.dispatch(clearUser());
//       window.location.href = '/login';
//     }
//   } catch (refreshError) {
//     store.dispatch(clearUser());
//     window.location.href = '/login';
//   }
    }

    return response;
  },
};