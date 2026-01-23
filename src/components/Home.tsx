import { useEffect, useState } from 'react';
import { allVideos, increaseViewCount } from '../Service/YoutubeService';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { dateAgo } from '../Service/Function';
import { toast } from 'react-toastify';

// A simple Skeleton component for better UX during loading
const VideoSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 aspect-video rounded-xl mb-3"></div>
    <div className="flex space-x-3">
      <div className="rounded-full bg-gray-300 h-10 w-10"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { searchTerm } = useOutletContext<{ searchTerm: string }>();
  const location = useLocation();
  const { message } = location.state || {};

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate('/home', { replace: true, state: null });
    }
  }, [message, navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userData?.accessToken) {
      setToken(userData.accessToken);
    }
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const data = await allVideos(searchTerm);
        setVideos(data);
      } catch (error: any) {
        toast.error('Failed to load videos');
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [searchTerm]);

  async function handleVideoClick(video: any) {
    if (token) {
      await increaseViewCount(token, video._id);
    }
    navigate(`/watch`, { state: { video } });
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8">
      {/* Search Result Header (Optional) */}
      {searchTerm && (
        <h2 className="text-xl font-medium mb-6 text-gray-700">
          Results for: <span className="font-bold text-black">"{searchTerm}"</span>
        </h2>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
          {[...Array(10)].map((_, i) => <VideoSkeleton key={i} />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] text-center">
          <div className="text-gray-300 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900">No videos found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
          {videos.map((video: any) => (
            <div
              key={video._id}
              className="cursor-pointer group flex flex-col"
              onClick={() => handleVideoClick(video)}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Duration Badge (Example static value, add dynamic if available) */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                  12:45
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-md rounded-full p-3 shadow-lg">
                      <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                   </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="mt-3 flex gap-3 px-1">
                <img
                  src={video.ownerInfo?.avatar || "https://ui-avatars.com/api/?name=" + video.ownerInfo?.username}
                  alt="channel"
                  className="h-9 w-9 shrink-0 rounded-full object-cover border border-gray-100"
                />
                <div className="flex flex-col overflow-hidden">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="mt-1 flex flex-col">
                    <p className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
                      {video.ownerInfo?.username}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      {video.views.toLocaleString()} views • {dateAgo(video.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;