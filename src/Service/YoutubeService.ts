import {apiUrl} from '../../constant'
import { urlRoutes } from './urlService';
import axios from 'axios';
export async function allVideos(text?: string) {  
  const baseUrl = `${apiUrl}/${urlRoutes.getVideo}`;
  
  const url = new URL(baseUrl);

  if (text) {
    url.searchParams.append('query', text);
  }
  const response = await fetch(url.toString(), {
    method: 'GET', 
  });

  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  const data = await response.json();
  return data.data;
}

export async function uploadVideo(
  formValues: { title: string, videoFile: File | null, thumbnail: File | null, description: string, duration: any },
  token: string,
  userId: string
) {
  const url = `${apiUrl}/${urlRoutes.uploadVideo}`;
  
  if (!formValues.videoFile) {
    throw new Error("Video file is required");
  }

  const chunkSize = 5 * 1024 * 1024; // 5MB chunk size
  const videoFile = formValues.videoFile;
  const totalChunks = Math.ceil(videoFile.size / chunkSize);

  // Create a FormData object for video metadata
  const formData = new FormData();
  formData.append('title', formValues.title);
  formData.append('description', formValues.description);
  formData.append('duration', formValues.duration);
  formData.append('owner', userId);

  if (formValues.thumbnail) {
    formData.append('thumbnail', formValues.thumbnail);
  }

  // Function to upload chunks
  const uploadChunk = (chunk: Blob, chunkIndex: number) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);

      // Set the authorization header
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Chunk-Index', `${chunkIndex}`);
      xhr.setRequestHeader('Total-Chunks', `${totalChunks}`);

      // Track the upload progress
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          const percentComplete = ((chunkIndex - 1 + event.loaded / event.total) / totalChunks) * 100;
          console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
          // You can update the progress bar here
        }
      };

      // On successful chunk upload
      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log(`Chunk ${chunkIndex} uploaded successfully`);
          resolve(xhr.responseText);
        } else {
          console.error(`Error uploading chunk ${chunkIndex}:`, xhr.status, xhr.responseText);
          reject(new Error(`Failed to upload chunk ${chunkIndex}: ${xhr.statusText}`));
        }
      };

      // Handle errors
      xhr.onerror = function () {
        console.error(`Error in uploadVideo function (chunk ${chunkIndex}):`, xhr.statusText);
        reject(new Error('Network error'));
      };

      // Send the chunk
      const chunkFormData = new FormData();
      chunkFormData.append('chunk', chunk);
      chunkFormData.append('metadata', JSON.stringify(formData));

      xhr.send(chunkFormData);
    });
  };

  // Split the file into chunks and upload them sequentially
  let chunkIndex = 0;
  const promises: Promise<any>[] = [];

  // Split video file into chunks
  for (let i = 0; i < videoFile.size; i += chunkSize) {
    const chunk = videoFile.slice(i, i + chunkSize);
    chunkIndex++;
    promises.push(uploadChunk(chunk, chunkIndex));
  }

  // Wait for all chunks to be uploaded
  try {
    const results = await Promise.all(promises);
    console.log("All chunks uploaded successfully:", results);
    // Finalize the video upload (you may need to notify the server to assemble the video)
    return { success: true };
  } catch (error:any) {
    console.error("Error uploading video:", error);
    return { success: false, error: error.message };
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

export const increaseViewCount = async(token: string,videoId: string)=>{
  const url = `${apiUrl}/api/v1/view/${videoId}`
 try {
  const res = await axios.post(url,{},getAuthHeaders(token));
  return res.data
 } catch (error) {
  console.log(error)
 }
}
