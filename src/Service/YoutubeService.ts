import {apiUrl} from '../../constant'
import { urlRoutes } from './urlService';
import axios from 'axios';
export async function allVideos(){
    const url = `${apiUrl}/${urlRoutes.getVideo}`;
  
  const headers = {
    'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjkyMjViODllYzNlOTMyYzI3ODc3NTUiLCJlbWFpbCI6ImFtaXQxMjM0NUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImFtaXQxMjM0NSIsImZ1bGxuYW1lIjoiQW1pdCBrdW1hciIsImlhdCI6MTcyMzQ5Mjk5MiwiZXhwIjoxNzIzNTc5MzkyfQ.7z6qAEsm91FFtOWMzgq7NnvWXDe_yWMbZ6khA8sjcDU'}`,
    'Content-Type': 'application/json'
  };
  
  const response = await fetch(url, {
    method: 'GET', // Assuming you're making a GET request
    headers: headers
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  
  const data = await response.json();
  return data.data;

}

export async function uploadVideo(formValues: { title: string, videoFile: File | null, thumbnail: File | null, description: string, duration: any }, token: string, userId:string) {
  console.log(token);
  
  const url = `${apiUrl}/${urlRoutes.uploadVideo}`;

  // Create a FormData object
  const formData = new FormData();
  formData.append('title', formValues.title);
  formData.append('description', formValues.description);
  formData.append('duration', formValues.duration);
  formData.append('owner',userId)
  
  if (formValues.videoFile) {
      formData.append('videoFile', formValues.videoFile);
  }
  
  if (formValues.thumbnail) {
      formData.append('thumbnail', formValues.thumbnail);
  }

  try {
      // Send the form data
      const response = await fetch(url, {      
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              // Content-Type is not needed for FormData, fetch will set it automatically
          },
          body: formData // Pass FormData object as the body
      });

      if (!response.ok) {
          // Log response status and body for debugging
          const errorText = await response.text();
          console.error('Upload error:', response.status, errorText);
          throw new Error(`Failed to upload video: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      return data;
  } catch (error) {
      console.error('Error in uploadVideo function:', error);
      throw error;
  }
}


const getAuthHeaders = (token: string) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

export const getLikedVideos = async (videoId: string, token: string) => {
  const url = `${apiUrl}/api/v1/likes/videos/${videoId}`;
  const response = await axios.get(url, getAuthHeaders(token));
  return response.data;
};

export const getIndividualVideoComments = async (videoId: string, token: string) => {
  const url = `${apiUrl}/api/v1/comments/${videoId}`;
  const response = await axios.get(url, getAuthHeaders(token));
  return response.data;
};

export const addComment = async (videoId: string, token: string, content: string) => {
  const url = `${apiUrl}/api/v1/comments/${videoId}`;
  const response = await axios.post(url, { content }, getAuthHeaders(token));
  return response.data;
};

export const likeComment = async (commentId: string, token: string) => {
  const url = `${apiUrl}/api/v1/likes/toggle/c/${commentId}`;
  const response = await axios.post(url, {}, getAuthHeaders(token));
  return response.data;
};

export const toogleLike = async (videoId: string, token: string) => {
  const url = `${apiUrl}/api/v1/likes/toggle/v/${videoId}`;
  const response = await axios.post(url, {}, getAuthHeaders(token));
  return response.data;
};

export const toogleSubscription = async (channelId: string, token: string) => {
  const url = `${apiUrl}/api/v1/subscriptions/c/${channelId}`;
  const response = await axios.post(url, {}, getAuthHeaders(token));
  return response.data;
};

export const getSubscribedChannel = async (channelId: string, token: string) => {
  const url = `${apiUrl}/api/v1/subscriptions/c/${channelId}`;
  const response = await axios.get(url, getAuthHeaders(token));
  return response.data;
};

export const editComment = async (data: { commentId: string; content: string; token: string }) => {
  const url = `${apiUrl}/api/v1/comments/c/${data.commentId}`;
  const response = await axios.patch(url, { content: data.content }, getAuthHeaders(data.token));
  return response.data;
};

export const deleteComment = async (data: { commentId: string; token: string }) => {
  const url = `${apiUrl}/api/v1/comments/c/${data.commentId}`;
  const response = await axios.delete(url, getAuthHeaders(data.token));
  return response.data;
};

export const addPlaylist = async (playlistName: string, playlistDescription: string, token: string) => {
  const url = `${apiUrl}/api/v1/playlist/create`;
  const response = await axios.post(url, { name: playlistName, description: playlistDescription }, getAuthHeaders(token));
  return response.data;
};

export const getPlaylist = async (token: string, userId: string) => {
  const url = `${apiUrl}/api/v1/playlist/user/${userId}`;
  const response = await axios.get(url, getAuthHeaders(token));
  return response.data;
};

export const addVideotoPlaylist = async (data: { videoId: string; playlistId: string; token: string }) => {
  const url = `${apiUrl}/api/v1/playlist/add/${data.videoId}/${data.playlistId}`;
  const response = await axios.patch(url, {}, getAuthHeaders(data.token));
  return response.data;
};

export const removeVideofromPlaylist = async (data: { videoId: string; playlistId: string; token: string }) => {
  const url = `${apiUrl}/api/v1/playlist/remove/${data.videoId}/${data.playlistId}`;
  const response = await axios.patch(url, {}, getAuthHeaders(data.token));
  return response.data;
};

export const getPlayListbyId = async (playListId: string, token: string) => {
  const url = `${apiUrl}/api/v1/playlist/${playListId}`;
  const response = await axios.get(url, getAuthHeaders(token));
  return response.data;
};

export const logout = async (token: string) => {
  const url = `${apiUrl}/api/v1/users/logout`;
  const response = await axios.post(url, {}, getAuthHeaders(token));
  return response.data;
};

export const register = async (formData: any) => {
  const url = `${apiUrl}/api/v1/users/register`;
  const response = await axios.post(url, formData);
  return response.data;
};

// sigin in 

export const signIn = async (formValues:any) => {
  const url = `${apiUrl}/api/v1/users/login`;

  try {
    const response = await axios.post(url, formValues);    
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error; // Rethrow the error to handle it in the component if needed
  }
};

// sign-up

export const signUp = async (formValues: any, token: any) => {
  const url = `${apiUrl}/api/v1/users/register`;
  const formData = new FormData();
  
  // Append form fields to FormData
  formData.append('email', formValues.email);
  formData.append('username', formValues.username);
  formData.append('fullname', formValues.fullname);
  formData.append('password', formValues.password);
  formData.append('avatar', formValues.avatar);
  formData.append('coverImage', formValues.coverImage);

  try {
    // Send POST request with token in headers
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required when sending files
        'Authorization': `Bearer ${token}`, // Set token in Authorization header
      },
    });
    
    return response.data;
  } catch (error) {
    // Handle errors here (e.g., log error, throw error to be handled by calling function)
    console.error('Error during sign-up:', error);
    throw error;
  }
};
