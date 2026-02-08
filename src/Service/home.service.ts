import api from "../core/api/interceptors/axios";
import { apiRoutes } from "../core/api/routes/routes";


export async function allVideos(text?: string) {
  const response = await api.get(apiRoutes.getVideo, {
    params: text ? { query: text } : {},
  });

  return response.data.data;
}