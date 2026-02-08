import api from "../core/api/interceptors/axios";

export const getLikedVideos = async (videoId: string) => {
  const response = await api.get(`/api/v1/likes/videos/${videoId}`);
  return response.data;
};

export const getIndividualVideoComments = async (videoId: string) => {
  const response = await api.get(`/api/v1/comments/${videoId}`);
  return response.data;
};

export const addComment = async (videoId: string, content: string) => {
  const response = await api.post(`/api/v1/comments/${videoId}`, { content });
  return response.data;
};

export const likeComment = async (commentId: string) => {
  const response = await api.post(`/api/v1/likes/toggle/c/${commentId}`, {});
  return response.data;
};

export const toogleLike = async (videoId: string) => {
  const response = await api.post(`/api/v1/likes/toggle/v/${videoId}`, {});
  return response.data;
};

export const toogleSubscription = async (channelId: string) => {
  const response = await api.post(`/api/v1/subscriptions/c/${channelId}`, {});
  return response.data;
};

export const getSubscribedChannel = async (channelId: string) => {
  const response = await api.get(`/api/v1/subscriptions/c/${channelId}`);
  return response.data;
};

export const editComment = async (commentId: string, content: string) => {
  const response = await api.patch(`/api/v1/comments/c/${commentId}`, { content });
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await api.delete(`/api/v1/comments/c/${commentId}`);
  return response.data;
};

export const downloadVideo = async (videoId: string) => {
  const response = await api.get(`/api/v1/videos/download/${videoId}`, {
    responseType: 'blob'
  });
  return response.data;
};