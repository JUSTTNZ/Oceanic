export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    let response = await fetch(input, {
        ...init,
        credentials: 'include'
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
        try {
            const refreshResponse = await fetch(
                'https://oceanic-servernz.vercel.app/api/v1/users/refreshToken', 
                {
                    method: 'POST',
                    credentials: 'include'
                }
            );

            if (!refreshResponse.ok) {
                throw new Error('Session expired. Please login again.');
            }

            // Retry original request with new tokens
            response = await fetch(input, {
                ...init,
                credentials: 'include'
            });
        } catch (refreshError) {
            // Redirect to login or handle session expiration
            console.log(refreshError)
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
}