import axios from 'axios';
import { apiUrl } from '../../constant';


const getAuthHeaders = (token: string) => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
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