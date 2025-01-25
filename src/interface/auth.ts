// src/types/Auth.ts
export interface AuthTokenData {
    accessToken: string;
    refreshToken: string;
    user: {
      _id: string;
      username: string;
      email: string;
      fullname: string;
      avatar?: string;
      coverImage?: string;
    };
  }
  