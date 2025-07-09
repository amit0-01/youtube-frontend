import{ useEffect, useState } from 'react';
import { allVideos, increaseViewCount } from '../Service/YoutubeService';
import {  useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { dateAgo } from '../Service/Function';
import Loader from './Loader';
import { toast } from 'react-toastify';



function Home() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken]= useState<any | null>('');
  const [count,setCount] = useState(0);
  const { searchTerm } = useOutletContext<{ searchTerm: string }>();
  const location = useLocation();
  const { message } = location.state || {};

  useEffect(() => {
    if ( message) {
      toast.success(message);
      navigate('/home', { replace: true, state: null });
    }
  }, [ message, navigate]);

  // FETCH TOKEN
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
    if (userData && userData.user) {      
      setToken(userData.accessToken);
    }
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const data = await allVideos(searchTerm);                
        setVideos(data); 
        
      } catch (error:any) {
        toast.error('Error fetching videos:', error);
      } finally{
        setLoading(false);
      }
    }

    fetchVideos();
  }, [searchTerm]); 
  
    async function getIndidualVideo(data: any) {
      if(token){      
      const increaseView = await increaseViewCount(token, data._id)
      if(increaseView.success){
      setCount(count+1);
      }
    }
      navigate(`/watch`, { state: { video: data } });
    }
  


    return (
      <>
        {loading ? (
          <Loader />
        ) : videos.length === 0 ? (
          <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
            No videos found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 bg-gray-50">
            {videos.map((data:any) => (
              <div
                key={data._id}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                onClick={() => getIndidualVideo(data)}
              >
                {/* Thumbnail Image */}
                <div className="relative">
                  <img
                    src={data.thumbnail}
                    alt="Video Thumbnail"
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
  
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Owner's Profile Image */}
                    <img
                      src="https://images.pexels.com/photos/20780444/pexels-photo-20780444/free-photo-of-person-hand-holding-shiny-glass-mug.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Owner"
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      {/* Title */}
                      <h1 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {data.title}
                      </h1>
                      {/* Owner */}
                      <p className="text-sm text-gray-600 mt-1">{data.ownerInfo.username}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                        {/* Views */}
                        <span>{data.views} views</span>
                        <span className="text-gray-400">•</span>
                        <span>{dateAgo(data.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Hover Play Icon */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100  transition-opacity duration-300">
                  <svg
                    className="w-12 h-12 text-white bg-black bg-opacity-50 rounded-full p-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
    
    
};

export default Home;
