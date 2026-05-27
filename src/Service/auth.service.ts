

import api from "../core/api/interceptors/axios";
import { storageService } from "./storageService";
const USER_KEY = "userInfo";

export const authService = {
  getUser() {
    return storageService.getItem(USER_KEY);
  },

  getAccessToken() {
    const user:any = this.getUser();
    return user?.accessToken || null;
  },

  setUser(user: any) {
    storageService.setItem(USER_KEY, user);
  },

  logout() {
    storageService.removeItem(USER_KEY);
  },

  async signIn(formValues:any) {
  try {
  const response = await api.post("/api/v1/users/login", formValues);
    return response.data; 
  } catch (error) {
    return error;
    throw error; 
  }
}
};