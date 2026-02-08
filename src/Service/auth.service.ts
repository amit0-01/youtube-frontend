// sigin in 

import api from "../core/interceptors/axios";

export const signIn = async (formValues:any) => {
  try {
  const response = await api.post("/api/v1/users/login", formValues);
    return response.data; // Return the response data
  } catch (error) {
    return error;
    throw error; // Rethrow the error to handle it in the component if needed
  }
};