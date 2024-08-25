import React, { useEffect, useState, ChangeEvent } from 'react';
import {useLocation } from 'react-router-dom';
import { getLikedVideos, getIndividualVideoComments, addComment, likeComment, toogleLike, toogleSubscription, getSubscribedChannel, editComment, deleteComment, allVideos } from '../Service/YoutubeService'; 
// import AddToPlaylistDialog from './AddToPlaylistDialog'; // import your AddToPlaylistDialog component
import { Button, TextField, Dialog } from '@mui/material'; // MUI components for the dialog
import AddToPlaylistDialog from './AddToPlaylistDialog';

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

const Watch: React.FC = () => {
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

  // Fetch data on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (userData && userData.user) {      
      setUser(userData.user._id); 
      setToken(userData.accessToken);
    }

    // if (data) {
    //   setVideoFile(data.videoFile);
    //   setVideoId(data._id);
    // }
    // if (data && !videoFile) { // Ensure it only sets once or under a specific condition
    //   setVideoFile(data.videoFile);
    //   setVideoId(data._id);
    // }

    if (userData.accessToken && data && data._id) {
      getLikedVideos(data._id, userData.accessToken).then((res: any) => {
        setVideoIsLiked(!!res.likedVideos);
      });

      getIndividualVideoComments(data._id, userData.accessToken).then((res: any) => {
        setComments(res.data || []);
      });

      getSubscribedChannel(userData.user._id, userData.accessToken).then((res: any) => {
        setSubscribedToChannel(res.data.length !== 0);
      });
      
    
    }
  }, [location, data]);

  useEffect(() => {
    if (data && counter==1) { // Ensure it only sets once or under a specific condition
      setVideoFile(data.videoFile);
      setVideoId(data._id);
      setCounter(counter+1);
    }
  },[]);
  

  useEffect(() => {
    allVideos().then((res:any)=>{      
      SetvideoData(res);
    })
  },[]);



  // Handle comment addition
  const handleAddComment = () => {
    if (user && token) {
      addComment(videoId, token, commentContent).then(() => {
        setCommentContent('');
        getIndividualVideoComments(videoId, user.token).then((res:any) => setComments(res.data));
      });
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
        setVideoIsLiked(res.message === 'Video liked successfully');
      });
    }
  };

  // Toggle subscription
  const handleToggleSubscription = () => {
    if (user && token) {
      toogleSubscription(user, token).then((res:any) => {
        setSubscribedToChannel(res.message === 'Subscribed to channel successfully');
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
      deleteComment({ commentId, token: token }).then(() => {
        getIndividualVideoComments(videoId, user.token).then((res:any) => setComments(res.data));
      });
    }
  };

  // change video when click 
  const handleVideoUrl = (video:any) =>{
   setVideoFile(video.videoFile);   
  }

  useEffect(() => {
    console.log('Updated videoFile:', videoFile);
  }, [videoFile]);

  return (
    <div className='lg:mx-16 lg:my-5 mx-2 my-2' >
      <div className="grid md:flex lg:flex justify-between">
        <main>
          {videoFile && (
            <div>
              <video key={videoFile} controls className="w-[900px] h-auto">
                <source src={videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="flex justify-between mt-4 gap-3">
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
                          <div className="w-full">
                            <TextField
                              value={newContent}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewContent(e.target.value)}
                              fullWidth
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
       <div className="grid gap-4 " >
      {videoData.map((video:any, index:any) => (
        <div
          key={index}
          className="flex w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          onClick={()=>handleVideoUrl(video)}
        >
          <div className="relative">
            {/* Thumbnail Image */}
            <img
              className="w-full h-48 object-cover"
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
  );
};

export default Watch;
