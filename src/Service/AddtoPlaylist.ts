import axios from "axios";
import { apiUrl } from "../../constant";
export const getPlaylist = async (token:any, userId:any) => {
    console.log("token",token);
    
    try {
      const response = await axios.get(`${apiUrl}/api/v1/playlist/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  };
  
  export const createPlaylist = async (token:any, playlistName:any, playlistDescription:any) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/playlist/create`,
        { name: playlistName, description: playlistDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  };
  

  export const addVideotoPlaylist = async (obj:any) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/playlist/add/${obj.videoId}/${obj.playlistId}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${obj.token}`, 
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding video to playlist:', error);
      throw error;
    }
  };
  
  export const removeVideofromPlaylist = async (obj:any) => {
    try {
      const response = await axios.patch(`${apiUrl}/api/v1/playlist/remove/${obj.videoId}/${obj.playlistId}`,
      {},
      {
        headers:{
            Authorization: `Bearer ${obj.token}`,
        },
    }
);
      return response.data;
    } catch (error) {
      console.error('Error removing video from playlist:', error);
      throw error;
    }
  };