import{ useEffect, useState } from 'react';
import { allVideos } from '../Service/YoutubeService';
import {  useNavigate } from 'react-router-dom';
import { dateAgo } from '../Service/Function';

function Home() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchVideos() {
      try {
        const data = await allVideos();
        console.log(data);
        
        setVideos(data); 
        // console.log(videos);
        
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }

    fetchVideos();
  }, []); 

  
    function getIndidualVideo(data: any) {
      navigate(`/watch`, { state: { video: data } });
    }
  


 
  return (
    <div className='grid md:grid-cols-5 gap-5 m-3'>
      {videos.map((data: any) => (
        <div key={data._id} >
          <div onClick={()=>getIndidualVideo(data)} className='cursor-pointer'>
            {/* Thumbnail Image */}
            <img 
              src={data.thumbnail} 
              alt="Video Thumbnail" 
              className='w-full h-48 object-cover rounded-lg' 
            />
            <div className='flex mx-2 my-2'>
              {/* Owner's Profile Image */}
              <img 
                src="https://images.pexels.com/photos/20780444/pexels-photo-20780444/free-photo-of-person-hand-holding-shiny-glass-mug.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Owner" 
                className='w-9 h-9 rounded-full' 
              />
              <div className='ms-3'>
                {/* Title */}
                <h1 className='text-lg font-bold'>{data.title}</h1>
                {/* Owner */}
                <p className='text-gray-500'>{data.ownerInfo.username}</p>
                <div className='flex'>
                  {/* Views */}
                  <p className='text-gray-500'>{data.views} views</p>
                  {/* Duration */}
                  {/* <p className='text-gray-500 ms-1'>{convertoMinute(data.duration)}</p> */}
                  <p className='text-gray-500 ms-1'>- {dateAgo(data.createdAt)}</p>

                </div>
              </div>
              {/* <div>
                <i className="fa-solid fa-ellipsis-vertical cursor-pointer"></i>
              </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
