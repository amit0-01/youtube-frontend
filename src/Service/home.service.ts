import api from "../core/api/interceptors/axios";
import { apiRoutes } from "../core/api/routes/routes";

export async function allVideos(text?: string, page = 1, limit = 10) {
  const response = await api.get(apiRoutes.getVideo, {
    params: {
      page,
      limit,
      ...(text && { query: text }),
    },
  });
  return response.data;
}