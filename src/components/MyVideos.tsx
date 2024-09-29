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
        console.log(userData);
        
    
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

      useEffect(() => {
        const fetchUserVideos = async () => {
          if (userId && token) {
            setLoading(true);
            try {
              const res = await getUserVideos(userId, token);
              setVideos(res.data);
            } catch (error) {
              console.error('Error fetching user videos:', error);
              setLoading(false); // Ensure loading is set to false if an error occurs
            } finally {
              setLoading(false); // Always set loading to false after the operation, regardless of success or error
            }
          }
        };
      
        fetchUserVideos();
      }, [userId, token]);



    // GO TO WATCH

    function getIndidualVideo(data: any) {
        console.log(data);
        
        navigate(`/watch`, { state: { video: data } });
      }


    // 

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();  // Prevents the default action
        event.stopPropagation(); 
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };


    
  // delete the video

        const handleDelete = (videoId:string) => {
            console.log(videoId);
            
            deleteUserVideo(token, videoId, userId).then((res:any)=>{
                setLoading(true);
                console.log(res);
                setVideos(res.data);
                setLoading(false);
            })    
            // Optionally: Add logic here to delete the video from the backend/server.
            
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
    <div key={data._id} >
      <div onClick={() => getIndidualVideo(data)} className='cursor-pointer'>
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
              <p className='text-gray-500 ms-1'>{convertoMinute(data.duration)}</p>
            </div>
          </div>
          {/* <div className='ms-auto'>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); // Prevents triggering getIndidualVideo when clicking delete
                handleDelete(data._id); 
              }}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div> */}
 <i className="fa-solid fa-ellipsis-vertical ms-24"
     id="basic-button"
     aria-controls={open ? 'basic-menu' : undefined}
     aria-haspopup="true"
     aria-expanded={open ? 'true' : undefined}
     onClick={handleClick}
    ></i>
  {/* Material UI Menu */}
  <Menu
    id="basic-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose} // Close when clicking outside
    MenuListProps={{
      'aria-labelledby': 'basic-button',
    }}
  >
    {/* Delete Menu Item with onClick */}
    <MenuItem
      onClick={(e) => { 
        e.preventDefault();
        e.stopPropagation(); // Prevent parent click handlers from triggering
        handleDelete(data._id); // Call delete handler with item id
        handleClose(); // Close the menu after delete
      }}
    >
      Delete
    </MenuItem>
    {/* Uncomment other menu items if needed */}
    {/* <MenuItem onClick={handleClose}>My account</MenuItem>
    <MenuItem onClick={handleClose}>Logout</MenuItem> */}
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