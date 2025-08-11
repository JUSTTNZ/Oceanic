// apiClient.ts
export const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    console.log("access token",token)
    
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Still include cookies for http-only tokens
    });

    if (response.status === 401) {
      // Handle token refresh here if needed
      await handleTokenRefresh();
    }

    return response;
  },
};

const handleTokenRefresh = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log("refreshe", refreshToken)
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    console.log("d", data)
    if (response.ok && data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      return true;
    }
    throw new Error('Refresh failed');
  } catch (error) {
    console.log(error)
    // Clear tokens and redirect to login if refresh fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return false;
  }
};

