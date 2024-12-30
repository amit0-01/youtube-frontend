import { Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { convertoMinute } from '../Service/Function';
import { useNavigate } from 'react-router-dom';
import { deleteUserVideo, getUserVideos } from '../Service/UserProfile';
import Loader from './Loader';

function MyVideos() {

    const [videos,setVideos] = useState([]);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [token, setToken] = useState('');
    const [userId,setUserId] = useState('');
    const open = Boolean(anchorEl);
    const [loading, setLoading ] = useState<boolean>(false);




    // GET USER INFO FROM LOCALSTORAGE

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userData && userData.user) {
          setUserId(userData.user._id);
          setToken(userData.accessToken);
        //   setCoverImage(userData.user.coverImage);
        //   setAvatar(userData.user.avatar);
        //   setUsername(userData.user.username);
        //   setName(userData.user.fullname)
        }
      }, []);


      // FETCH VIDEOS
      const fetchUserVideos = async () => {
        if (userId && token) {
          setLoading(true);
          try {
            const res = await getUserVideos(userId, token);
            setVideos(res.data);
            // console.log('res.data',res.data);
            
            console.log('videos',videos)
          } catch (error) {
            console.error('Error fetching user videos:', error);
            setLoading(false);
          } finally {
            setLoading(false); 
          }
        }
      };
    

      useEffect(() => {
        fetchUserVideos();
      }, [userId, token]);



    // GO TO WATCH

    function getIndidualVideo(data: any) {        
        navigate(`/watch`, { state: { video: data } });
      }


    // 

    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      // event.preventDefault();
        e.stopPropagation(); 
        setAnchorEl(e.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };


    
  // delete the video

        const handleDelete = (videoId:string) => {            
            deleteUserVideo(token, videoId, userId).then((res:any)=>{
                console.log('res',res);
                
                setLoading(true);
                fetchUserVideos();
                // setVideos(res.data);
                setLoading(false);
            })    
            
            // Remove the video from the local state
            // const updatedVideos = videos.filter((video) => video._id !== videoId);
            // setVideoList(updatedVideos);
        };
    
       


  return (
    <> {loading ? (
      <Loader/>
    ) :(
  <div className='grid md:grid-cols-5 gap-5  mt-2'>
  {videos.map((data:any) => (
    <div key={data._id}>
    <div onClick={() => getIndidualVideo(data)} className='cursor-pointer'>
      {/* Thumbnail Image */}
      <img 
        src={data.thumbnail} 
        alt="Video Thumbnail" 
        className='w-full h-48 object-cover rounded-lg' 
      />
      <div className='flex mx-2 my-2 justify-between'>
        {/* Owner's Profile Image */}
        <div className='flex'>
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
              <p className='text-gray-500 ms-1'>{convertoMinute(data.duration)}</p>
            </div>
          </div>
        </div>
        <i
        className="fa-solid fa-ellipsis-vertical cursor-pointer bg-transparent flex h-fit rounded-3xl"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e); 
        }}
        style={{ outline: 'none' }} 
      ></i>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose} 
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              handleDelete(data._id); 
              handleClose(); 
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  </div>
  ))}
</div>
    )
}
</>

  )
}

export default MyVideos