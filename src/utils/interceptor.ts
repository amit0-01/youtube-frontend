// src/setupFetchInterceptor.ts
import { toast } from 'react-toastify';
import { apiUrl } from '../../constant';
import { getAuthToken, setAuthToken, getRefreshToken } from './auth';

const API_BASE_URL = apiUrl; // Replace with your actual API base URL

export const setupFetchInterceptor = () => {
  const originalFetch = window.fetch;
  

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    
    if (!init) init = {};
    if (!init.headers) init.headers = {};

    // Attach the Authorization header if a token exists
    let accessToken = getAuthToken();
    if (accessToken) {
      (init.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
    }

    // Make the API call
    let response = await originalFetch(input, init);
    
    // Handle token expiry (401)
    if (response.status === 401) {
      toast.warn('Access token expired. Attempting to refresh...');

      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available. Please log in again.');
      }

      // Attempt to refresh the token
      const refreshResponse = await originalFetch(`${API_BASE_URL}/api/v1/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setAuthToken(refreshData); // Save the new token

        // Retry the original request with the new token
        accessToken = refreshData.accessToken;
        (init.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;

        response = await originalFetch(input, init);
      } else {
        console.error('Failed to refresh token. Please log in again.');
        throw new Error('Token refresh failed.');
      }
    }

    return response;
  };
};
