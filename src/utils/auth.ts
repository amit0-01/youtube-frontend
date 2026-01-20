// src/utils/auth.ts
import {jwtDecode} from 'jwt-decode';
import { AuthTokenData } from '../interface/auth';

interface DecodedToken {
  exp: number; // Expiry time in seconds since epoch
}

export const getAuthToken = (): string | null => {
  const userInfo = localStorage.getItem('userInfo');

  if (!userInfo) return null;

  const { accessToken } = JSON.parse(userInfo) as AuthTokenData;
  const decoded = jwtDecode<DecodedToken>(accessToken);
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  // Check if the token is expired
  if (now >= decoded.exp) {
    return null; // Token has expired
  }

  return accessToken; 
};

export const getRefreshToken = (): string | null => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return null;

  const { refreshToken } = JSON.parse(userInfo) as AuthTokenData;
  return refreshToken;
};

export const setAuthToken = (data: AuthTokenData): void => {
  localStorage.setItem('userInfo', JSON.stringify(data));
};
