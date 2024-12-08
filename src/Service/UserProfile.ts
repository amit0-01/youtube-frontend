import axios from 'axios';
import { apiUrl } from '../../constant';


const getAuthHeaders = (token: string) => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const getAuthHeadersForFile = (token: string) => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

export const getUserVideos = async(userId:string,token:string) => {
     const url = `${apiUrl}/api/v1/videos/users/${userId}`;
     const response = await axios.get(url,getAuthHeaders(token));
     return response.data;
   
}

export const deleteUserVideo = async(token:string, videoId:string, userId:string) =>{
    const url = `${apiUrl}/api/v1/videos/${videoId}/${userId}`
    const response = await axios.delete(url,getAuthHeaders(token));
    return response.data
}

// CHANGE AVATAR

export const changeUserAvatar = async(formData:FormData,token:string)=>{
  const url = `${apiUrl}/api/v1/users/avatar`
  const response = await axios.patch(url,formData,getAuthHeadersForFile(token));
  return response.data;
}

// CHANGE COVER IMAGE

export const changeCoverImage = async(formData:FormData, token:string)=>{  
  const url = `${apiUrl}/api/v1/users/cover-image`
  const response = await axios.patch(url,formData,getAuthHeadersForFile(token));
  return response.data;
}

// GET CURRENT USER DATA
export async function getCurrentUser(token:string){
  console.log('token',token);
  
const url = `${apiUrl}/api/v1/users/current-user`
const response = await axios.get(url,getAuthHeaders(token));
return response.data
}

// UPDATE ACCOUTN FULLNAME AND EMAIL
export const updateUserAccountEmailAndFullName = async(payload:any,token:string) =>{
const url = `${apiUrl}/api/v1/users/update-account`
const response = await axios.patch(url,payload,getAuthHeaders(token))
return response.data;
}