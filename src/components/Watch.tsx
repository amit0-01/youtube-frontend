import { useEffect, useState, ChangeEvent } from 'react';
import {useLocation } from 'react-router-dom';
import { getLikedVideos, getIndividualVideoComments, addComment, likeComment, toogleLike, toogleSubscription, getSubscribedChannel, editComment, deleteComment, allVideos } from '../Service/YoutubeService'; 
// import AddToPlaylistDialog from './AddToPlaylistDialog'; // import your AddToPlaylistDialog component
import { Button, TextField, Dialog } from '@mui/material'; // MUI components for the dialog
import AddToPlaylistDialog from './Dialog/AddToPlaylistDialog';
import Loader from './Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from '@mui/material/Tooltip';


interface Comment {
  _id: string;
  content: string;
  owner: {
    username: string;
  };
}

// interface User {
//   token: string;
//   user: string;
// }

const Watch: any = () => {
  const location = useLocation();
  const data = location.state?.video;

  const [videoFile, setVideoFile] = useState<string | null>(null);
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
  }, []); // Runs only once when the component mounts
   

  

   // New useEffect to handle fetching video-related data
   useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData is running');

      try {
        // Ensure `data` exists before calling these functions
        if (!data?._id) return;

        const likedRes = await getLikedVideos(data._id, token);
        setVideoIsLiked(!!likedRes.likedVideos);

        const commentsRes = await getIndividualVideoComments(data._id, token);
        setComments(commentsRes.data || []);

        const subscribedRes = await getSubscribedChannel(user, token);
        setSubscribedToChannel(subscribedRes.data.length !== 0);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    // Only run fetchData if all dependencies are available
    if (user && token && data?._id) {
      fetchData();
    }
  }, [user, token, data]); // Depend on user, token, and data

  useEffect(() => {
    if (data && counter==1) { 
      setVideoFile(data.videoFile);
      setVideoId(data._id);
      setCounter(counter+1);
    }
  },[]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await allVideos(); // Await the result of allVideos()
        SetvideoData(res); // Only set the data after fetching
      } catch (error) {
        console.error('Error fetching videos', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData(); // Call the fetchData function inside useEffect
  }, []); // Empty dependency array to run only once



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
        console.error('Error adding comment:', error);
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
    console.log(comment);
    
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
        
        // getIndividualVideoComments(videoId, user.token).then((res:any) => setComments(res.data));
      });
    }
  };

  // change video when click 
  const handleVideoUrl = (video:any) =>{
   setVideoFile(video.videoFile);   
  }

  const userLoggedInOrNot = () => {
    return !!token; // Returns true if token exists and is not falsy
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
    console.log(newValue); // This will log the new value being typed
  
    // Example of how you might update the comment based on the commentId
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
    <div className='mx-3 my-3' >
      <div className="grid grid-cols-3 gap-5">
        <main className='col-span-2'>
          {videoFile && (
            <div>
              <video key={videoFile} controls className="w-full h-96">
                <source src={videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* <div className="flex justify-between mt-4 gap-3">
                <div className='flex gap-3'>
                  <Button variant="contained" color="primary" onClick={handleToggleLike}>
                    {videoIsLiked ? 'Unlike' : 'Like'}
                  </Button>
                  <Button variant="contained" color="secondary">
                    Dislike
                  </Button>
                  <Button variant="contained" color="success" onClick={handleToggleSubscription}>
                    {subscribedToChannel ? 'Unsubscribe' : 'Subscribe'}
                  </Button>
                </div>
                <div>
                  <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
                    Add to playlist
                  </Button>
                </div>
              </div> */}
                <div className="flex justify-between">
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
      className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
      onClick={handleToggleSubscription}
    >
      {subscribedToChannel ? 'Unsubscribe' : 'Subscribe'}
    </button>
  </Tooltip>
      </div>
      <div className="flex items-center space-x-4 ml-auto">
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
        <i className="fa-solid fa-share text-lg cursor-pointer" />
        <i className="fa-solid fa-download text-lg cursor-pointer" />
        <i className="fa-solid fa-scissors text-lg cursor-pointer" />
        <i className="fa-regular fa-bookmark text-lg cursor-pointer" />
        <Tooltip title={userLoggedInOrNot() ? 'Save video' : 'Login to save the video'}>
        <i className="fa-solid fa-ellipsis text-lg cursor-pointer" onClick={handleDialogForSaveVideo} />
        </Tooltip>
      </div>
      </div>
    </div>
              <div className="mt-4">
                <TextField
                  value={commentContent}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCommentContent(e.target.value)}
                  placeholder="Add a comment"
                  fullWidth
                />
                <div className='mt-3'>
                <Button variant="contained" color="primary" onClick={handleAddComment}>
                  Comment
                </Button>
                </div>
                <div id="comments-container" className="mt-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="comment bg-gray-50 p-4 rounded shadow">
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
                          <div className="flex gap-3" style={{ display: editingCommentId !== comment._id ? 'flex' : 'none' }}>
                            <i onClick={() => setEditingCommentId(comment._id)} className="fa-solid fa-pen-to-square cursor-pointer" />
                            <i onClick={() => handleDeleteComment(comment._id)} className="fa-solid fa-trash cursor-pointer" />
                          </div>
                      </div>
                      <div className="actions flex space-x-4">
                        <i onClick={() => handleLikeComment(comment._id)} className="fa-regular fa-thumbs-up text-lg cursor-pointer" style={{ color: isLiked(comment._id) ? 'green' : 'inherit' }} />
                        <i className="fa-regular fa-thumbs-down text-lg cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
       {/* side vide cards */}
       <div className="grid gap-4 w-full " >
      {videoData.map((video:any, index:any) => (
        <div
          key={index}
          className="flex w-full bg-white rounded-lg overflow-hidden cursor-pointer h-36"
          onClick={()=>handleVideoUrl(video)}
        >
          <div className="relative">
            {/* Thumbnail Image */}
            <img
              className="w-48 h-32 object-cover"
              src={video.thumbnail} // Assume the API provides a `thumbnailUrl` field
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
            <h3 className="text-md font-semibold text-gray-900 leading-tight">
              {video.title} {/* Assuming your API returns a `title` field */}
            </h3>
            {/* Channel Name */}
            <p className="text-sm text-gray-600">{video._id}</p>
            {/* View Count and Time */}
            <p className="text-xs text-gray-500">
              {video.views} • {video.createdAt} {/* Adjust these fields according to your API */}
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
