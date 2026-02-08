// sigin in 

import api from "../core/api/interceptors/axios";

export const signIn = async (formValues:any) => {
  try {
  const response = await api.post("/api/v1/users/login", formValues);
    return response.data; 
  } catch (error) {
    return error;
    throw error; 
  }
};