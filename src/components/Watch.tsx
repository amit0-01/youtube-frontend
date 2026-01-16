import { useEffect, useState, ChangeEvent } from 'react';
import {useLocation } from 'react-router-dom';
import { getLikedVideos, getIndividualVideoComments, addComment, likeComment, toogleLike, toogleSubscription, getSubscribedChannel, editComment, deleteComment, allVideos } from '../Service/YoutubeService'; 
// import AddToPlaylistDialog from './AddToPlaylistDialog'; // import your AddToPlaylistDialog component
import { Button, Dialog, Input } from '@mui/material'; // MUI components for the dialog
import AddToPlaylistDialog from './Dialog/AddToPlaylistDialog';
import Loader from './Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from '@mui/material/Tooltip';
import { dateAgo } from '../Service/Function';
import 'youtube-video-element';
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";


interface Comment {
  _id: string;
  content: string;
  owner: {
    username: string;
    _id: string
  };
}

// interface User {
//   token: string;
//   user: string;
// }

const Watch: any = () => {
  const location = useLocation();
  const [data,setData] = useState(location.state?.video);

  // const [videoFile, setVideoFile] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string>('');
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken]= useState<any | null>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [videoIsLiked, setVideoIsLiked] = useState<boolean>(false);
  const [subscribedToChannel, setSubscribedToChannel] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>('');
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [videoData, SetvideoData] = useState<any>([])
  const [counter,setCounter] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);


  // Fetch data on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
    if (userData && userData.user) {      
      setUser(userData.user._id); 
      setToken(userData.accessToken);
    }
  }, []);


  // GET COMMENTS 

  const getComments = async()=>{
    const commentsRes = await getIndividualVideoComments(data._id, token);
    setComments(commentsRes.data || []);      
  }
   

  

   // New useEffect to handle fetching video-related data
   useEffect(() => {
    const fetchData = async () => {
      try {
        if (!data?._id) return;

        const likedRes = await getLikedVideos(data._id, token);
        setVideoIsLiked(!!likedRes.likedVideos);
        await getComments();

        const subscribedRes = await getSubscribedChannel(user, token);
        setSubscribedToChannel(subscribedRes.data.length !== 0);
      } catch (error:any) {
        toast.error('Error fetching data', error);
      }
    };
    if (user && token && data?._id) {
      fetchData();
    }
  }, [user, token, data]); 

  useEffect(() => {
    if (data && counter==1) {       
      setVideoId(data._id);
      setCounter(counter+1);
    }
  },[]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await allVideos(); 
        SetvideoData(res); 
      } catch (error:any) {
        toast.error('Error fetching videos', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);



  // Handle comment addition
  const handleAddComment = async () => {
    if (user && token) {
      try {
        setLoading(true);
        const res = await addComment(videoId, token, commentContent);
        setCommentContent('');
  
        if (res.success) {
          const commentsRes = await getIndividualVideoComments(data._id, token);          
          setComments(commentsRes.data || []);
          setLoading(false);
          toast.success('Comment Added Successfully');
        }
        
      } catch (error) {
        toast.error('Failed to add comment');
      }
    }
  };
  
  

  // Handle like comment
  const handleLikeComment = (commentId: string) => {    
    if (user && token) {
      likeComment(commentId,token).then((response:any) => {
        if (response.success && response.newLike) {
          setLikedItems((prevItems) => [...prevItems, response.newLike.comment]);
        } else if (response.success && !response.newLike) {
          setLikedItems((prevItems) => prevItems.filter((id) => id !== commentId));
        }
      });
    }
  };

  // Check if comment is liked
  const isLiked = (commentId: string) => likedItems.includes(commentId);

  // Toggle video like
  const handleToggleLike = () => {
    if (user && token) {
      toogleLike(videoId,token).then((res:any) => {
        toast.success(res.message);
        setVideoIsLiked(res.message === 'Video liked successfully');
      });
    }
  };

  // Toggle subscription
  const handleToggleSubscription = () => {
    if (user && token) {
      setLoading(true);
      toogleSubscription(user, token).then((res:any) => {
        if(res.success){
        toast.success(res.message);
        setSubscribedToChannel(res.message === 'Subscribed to channel successfully');
        setLoading(false);
        }
      });
    }
  };

  // Handle edit comment
  const handleEditComment = (comment: Comment) => {    
    if (user && user.token) {
      const obj = {
        commentId: comment._id,
        content: newContent,
        token: user.token,
      };
      editComment(obj).then(() => {
        setEditingCommentId(null);
        setNewContent('');
        getIndividualVideoComments(videoId, user.token).then((res:any) => setComments(res.data));
      });
    }
  };

  // Handle delete comment
  const handleDeleteComment = (commentId: string) => {
    if (user && token) {
      setLoading(true);
      deleteComment({ commentId, token: token }).then((res) => {
        if(res.success){
          setComments((prevComments)=>prevComments.slice(0,-1));
          setLoading(false);
          toast.success('comment deleted succesfully')
        }else{
          toast.error('Failed to delte comment')
        }
        
      });
    }
  };

  // change video when click 
  const handleVideoUrl = (video:any) =>{
    setData(video)
    
  //  setVideoFile(video.videoFile);   
  window.scrollTo({
    top : 0,
    behavior : 'smooth'
  })
  }

  const userLoggedInOrNot = () => {
    return !!token;
  };

  // HANDLE DIALOG FOR SAVE VIDEO
  const handleDialogForSaveVideo = () =>{
    if(userLoggedInOrNot()){
      setOpenDialog(true);
    } else{
      return;
    }
  }

  // HANDLE CONTENT CHANGE
  const handleContentChange = (e: ChangeEvent<HTMLInputElement>, commentId: string) => {
    const newValue = e.target.value;
  
    setComments(prevComments =>
      prevComments.map((comment:any) =>
        comment.id === commentId
          ? { ...comment, content: newValue }
          : comment
      )
    );
  };
 
  
  
  return (
    <>
    { loading ? (
      <Loader/>
    ) : (
    <div className='md:mx-3' >
      <div className="grid md:grid-cols-3 gap-5">
        <main className='md:col-span-2'>
          {data.videoFile && (
            <div>
              {/* <video key={data.videoFile} controls crossOrigin="anonymous" playsInline className="w-full md:h-96 h-50">
                <source src={data.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video> */}
              <Plyr
            source={{
              type: "video",
              sources: [
                {
                  src: data.videoFile,
                  type: "video/mp4",
                },
              ],
            }}
            options={{
              controls: [
                "play-large",
                "play",
                "progress",
                "current-time",
                "mute",
                "volume",
                "settings",
                "fullscreen",
              ],
              settings: ["speed", "quality"],
              speed: { selected: 1, options: [0.5, 1, 1.25, 1.5, 2] },
            }}
          />
      
              <div className='mt-3 font-bold'>{data.title}</div>
                <div className="flex gap-6 md:justify-between mx-3">
      <div className="flex items-center space-x-2 mt-5">
        <img
          src={data.thumbnail}
          alt="Profile"
          className="rounded-full w-10 h-10"
        />
        <div>
          <h2 className="text-sm font-semibold">{data.ownerInfo.username}</h2>
          <p className="text-xs text-gray-500">33.2K subscribers</p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <div >
        <Tooltip title={userLoggedInOrNot() ? (subscribedToChannel ? 'Unsubscribe from this channel' : 'Subscribe to this channel') : 'Sign in to subscribe to the channel'}>
    <button
      className="bg-blue-600 text-white px-1 py-0.5 md:px-4 md:py-2 rounded-full text-sm font-medium"
      onClick={handleToggleSubscription}
    >
      {subscribedToChannel ? 'Unsubscribe' : 'Subscribe'}
    </button>
  </Tooltip>
      </div>
      <div className="flex items-center gap-2 md:space-x-4 ml-auto">
        <div className="flex items-center space-x-1">
        <Tooltip title={userLoggedInOrNot() ? 'Like' : 'Sign in to like this video'}>
    <i
      className={`fa-regular fa-thumbs-up text-lg cursor-pointer ${videoIsLiked ? 'text-blue-500' : 'text-gray-500'}`}
      onClick={handleToggleLike}
    />
  </Tooltip>       
          <span className="text-sm">26</span>
        </div>
        <i className="fa-regular fa-thumbs-down text-lg cursor-pointer" />
        <i className="fa-solid fa-share text-lg cursor-pointer hidden md:block "/>
        <i className="fa-solid fa-download text-lg cursor-pointer hidden  md:block" />
        <i className="fa-solid fa-scissors text-lg cursor-pointer  md:block" />
        <i className="fa-regular fa-bookmark text-lg cursor-pointer hidden md:block" />
        <Tooltip title={userLoggedInOrNot() ? 'Save video' : 'Login to save the video'}>
        <i className="fa-solid fa-ellipsis text-lg cursor-pointer" onClick={handleDialogForSaveVideo} />
        </Tooltip>
      </div>
      </div>
    </div>
              <div className="flex gap-1 mt-4">
              <Input
            value={commentContent}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCommentContent(e.target.value)}
            placeholder="Add a comment"
            fullWidth
            sx={{
              height: "40px",
              "& .MuiInputBase-root": { height: "100%" },
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Dark mode background color
              color: "gray", // Text color in dark mode
              "&::placeholder": {
                color: "rgba(255, 255, 255, 0.5)", // Lighter placeholder color for dark mode
              },
              borderRadius: "4px", // Optional: add border radius for smoother edges
            }}
          />

                          <div >
                <Button variant="contained" color="primary" onClick={handleAddComment}>
                  Comment
                </Button>
                </div>
                </div>
                <div id="comments-container" className="mt-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="comment border p-4 rounded shadow">
                      <div className="username font-bold mb-2">{comment.owner.username}</div>
                      <div className="flex justify-between">
                        {editingCommentId !== comment._id ? (
                          <div className="content mb-2">{comment.content}</div>
                        ) : (
                          <div className="w-full flex gap-2">
                           <input
                            value={comment.content}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleContentChange(e, comment._id)}
                            className='w-full border outline-none'
                          />

                            <div className="flex justify-end gap-2">
                              <Button variant="contained" color="primary" onClick={() => setEditingCommentId(null)}>
                                Cancel
                              </Button>
                              <Button variant="contained" color="primary" onClick={() => handleEditComment(comment)}>
                                Save
                              </Button>
                            </div>
                          </div>
                        )}
                     {user === comment.owner._id ? (
                            <div className="flex gap-3" style={{ display: editingCommentId !== comment._id ? 'flex' : 'none' }}>
                              <Tooltip title="Edit">
                                <span>
                                  <i onClick={() => setEditingCommentId(comment._id)} className="fa-solid fa-pen-to-square cursor-pointer" />
                                </span>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <span>
                                  <i onClick={() => handleDeleteComment(comment._id)} className="fa-solid fa-trash cursor-pointer" />
                                </span>
                              </Tooltip>
                            </div>
                          ) : <></>}

                   
                      </div>
                      <div className="actions flex space-x-4">
                            <Tooltip title="Like">
                              <span>
                                <i
                                  onClick={() => handleLikeComment(comment._id)}
                                  className="fa-regular fa-thumbs-up text-lg cursor-pointer"
                                  style={{ color: isLiked(comment._id) ? 'green' : 'inherit' }}
                                />
                              </span>
                            </Tooltip>

                            <Tooltip title="Dislike">
                              <span>
                                <i className="fa-regular fa-thumbs-down text-lg cursor-pointer" />
                              </span>
                            </Tooltip>
                          </div>
                    </div>
                  ))}
                </div>
            </div>
          )}
        </main>
       {/* side vide cards */}
       <div className="flex flex-col gap-2 w-full mx-1 md:mx-0 md:mt-2" >
      {videoData.map((video:any, index:any) => (
        <div
          key={index}
          className="flex w-full rounded-lg overflow-hidden cursor-pointer h-36"
          onClick={()=>handleVideoUrl(video)}
        >
          <div className="relative">
            {/* Thumbnail Image */}
            <img
              className="w-48 h-32 object-cover rounded-lg"
              src={video.thumbnail} 
              alt="Thumbnail"
            />
            {/* Live Badge */}
            {video.isLive && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                LIVE
              </div>
            )}
          </div>
          <div className="p-4">
            {/* Video Title */}
            <h3 className="text-md font-semibold leading-tight">
              {video.title}
            </h3>
            {/* Channel Name */}
            <p className="text-sm  text-gray-500">{video.ownerInfo.username}</p>
            {/* View Count and Time */}
            <p className="text-xs text-gray-500">
              {video.views} {video.views<=1? 'view' : 'views'} • {dateAgo(video.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
      
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <AddToPlaylistDialog
    videoId={videoId}
    open={openDialog}  
    onClose={() => setOpenDialog(false)} 
  />
</Dialog>

    </div>
    )
    }
    </>
  );
};

export default Watch;
