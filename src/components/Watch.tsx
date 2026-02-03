import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  getLikedVideos, 
  getIndividualVideoComments, 
  addComment, 
  likeComment, 
  toogleLike, 
  toogleSubscription, 
  getSubscribedChannel, 
  editComment, 
  deleteComment, 
  allVideos, 
  downloadVideo
} from '../Service/YoutubeService';
import { Button, Dialog, Input, Tooltip } from '@mui/material';
import AddToPlaylistDialog from './Dialog/AddToPlaylistDialog';
import WatchSkeleton from '../core/skeltons/watch';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { dateAgo } from '../Service/Function';
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import { Comment } from '../core/interface/watch';

const Watch = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state?.video);
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [videoIsLiked, setVideoIsLiked] = useState(false);
  const [subscribedToChannel, setSubscribedToChannel] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const videoId = useMemo(() => data?._id || '', [data]);
  const isUserLoggedIn = useMemo(() => !!token, [token]);

  // Initialize user data once on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userData?.user) {
      setUser(userData.user._id);
      setToken(userData.accessToken);
    }
  }, []);

  // Fetch comments - memoized
  const fetchComments = useCallback(async () => {
    if (!videoId || !token) return;
    try {
      const res = await getIndividualVideoComments(videoId, token);
      setComments(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch comments');
    }
  }, [videoId, token]);

  // Fetch all video data once
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const res = await allVideos();
        setVideoData(res);
      } catch (error) {
        toast.error('Error fetching videos');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchAllVideos();
  }, []);

  // Fetch video-related data when dependencies change
  useEffect(() => {
    const fetchVideoData = async () => {
      if (!user || !token || !videoId) {
        setInitialLoading(false);
        return;
      }

      try {
        const [likedRes, subscribedRes] = await Promise.all([
          getLikedVideos(videoId, token),
          getSubscribedChannel(user, token)
        ]);

        setVideoIsLiked(!!likedRes.likedVideos);
        setSubscribedToChannel(subscribedRes.data.length !== 0);
        await fetchComments();
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchVideoData();
  }, [user, token, videoId, fetchComments]);

  // Add comment handler
  const handleAddComment = useCallback(async () => {
    if (!isUserLoggedIn || !commentContent.trim()) return;

    try {
      setLoading(true);
      const res = await addComment(videoId, token, commentContent);
      
      if (res.success) {
        setCommentContent('');
        await fetchComments();
        toast.success('Comment added successfully');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  }, [isUserLoggedIn, commentContent, videoId, token, fetchComments]);

  // Like comment handler
  const handleLikeComment = useCallback(async (commentId: string) => {
    if (!isUserLoggedIn) return;

    try {
      const response = await likeComment(commentId, token);
      
      if (response.success) {
        setLikedItems(prev => {
          const newSet = new Set(prev);
          if (response.newLike) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });
      }
    } catch (error) {
      toast.error('Failed to like comment');
    }
  }, [isUserLoggedIn, token]);

  // Toggle video like
  const handleToggleLike = useCallback(async () => {
    if (!isUserLoggedIn) return;

    try {
      const res = await toogleLike(videoId, token);
      toast.success(res.message);
      setVideoIsLiked(res.message === 'Video liked successfully');
    } catch (error) {
      toast.error('Failed to toggle like');
    }
  }, [isUserLoggedIn, videoId, token]);

  // Toggle subscription
  const handleToggleSubscription = useCallback(async () => {
    if (!isUserLoggedIn || !user) return;

    try {
      setLoading(true);
      const res = await toogleSubscription(user, token);
      
      if (res.success) {
        toast.success(res.message);
        setSubscribedToChannel(res.message === 'Subscribed to channel successfully');
      }
    } catch (error) {
      toast.error('Failed to toggle subscription');
    } finally {
      setLoading(false);
    }
  }, [isUserLoggedIn, user, token]);

  // Edit comment handler
  const handleEditComment = useCallback(async (comment: Comment) => {
    if (!isUserLoggedIn) return;

    try {
      await editComment({
        commentId: comment._id,
        content: comment.content,
        token
      });
      
      setEditingCommentId(null);
      await fetchComments();
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to edit comment');
    }
  }, [isUserLoggedIn, token, fetchComments]);

  // Delete comment handler
  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!isUserLoggedIn) return;

    try {
      setLoading(true);
      const res = await deleteComment({ commentId, token });
      
      if (res.success) {
        setComments(prev => prev.filter(c => c._id !== commentId));
        toast.success('Comment deleted successfully');
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  }, [isUserLoggedIn, token]);

  // Change video handler
  const handleVideoUrl = useCallback((video: any) => {
    setData(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle content change for editing
  const handleContentChange = useCallback((value: string, commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment._id === commentId
          ? { ...comment, content: value }
          : comment
      )
    );
  }, []);

  // Handle dialog for save video
  const handleDialogForSaveVideo = useCallback(() => {
    if (isUserLoggedIn) {
      setOpenDialog(true);
    }
  }, [isUserLoggedIn]);

  // DOWNLOAD VIDEO 
  const handleDownloadVideo = () => {
    if (!isUserLoggedIn) {
      alert("Please login to download the video");
      return;
    }

    if (!data?._id) {
      console.error("Video ID missing");
      return;
    }

    downloadVideo(data._id);
  };

  // Show skeleton while initial loading
  if (initialLoading) {
    return <WatchSkeleton />;
  }

  if (!data) {
    return <div>No video data available</div>;
  }

  return (
    <div className='md:mx-3'>
      <div className="grid md:grid-cols-3 gap-5">
        <main className='md:col-span-2'>
          {data.videoFile && (
            <div>
              <Plyr
                source={{
                  type: "video",
                  sources: [{ src: data.videoFile, type: "video/mp4" }]
                }}
                options={{
                  controls: [
                    "play-large", "play", "progress", "current-time",
                    "mute", "volume", "settings", "fullscreen"
                  ],
                  settings: ["speed", "quality"],
                  speed: { selected: 1, options: [0.5, 1, 1.25, 1.5, 2] }
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
                  <Tooltip title={
                    isUserLoggedIn 
                      ? (subscribedToChannel ? 'Unsubscribe from this channel' : 'Subscribe to this channel')
                      : 'Sign in to subscribe to the channel'
                  }>
                    <button
                      className="bg-blue-600 text-white px-1 py-0.5 md:px-4 md:py-2 rounded-full text-sm font-medium"
                      onClick={handleToggleSubscription}
                    >
                      {subscribedToChannel ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                  </Tooltip>

                  <div className="flex items-center gap-2 md:space-x-4 ml-auto">
                    <div className="flex items-center space-x-1">
                      <Tooltip title={isUserLoggedIn ? 'Like' : 'Sign in to like this video'}>
                        <i
                          className={`fa-regular fa-thumbs-up text-lg cursor-pointer ${
                            videoIsLiked ? 'text-blue-500' : 'text-gray-500'
                          }`}
                          onClick={handleToggleLike}
                        />
                      </Tooltip>
                      <span className="text-sm">26</span>
                    </div>
                    <i className="fa-regular fa-thumbs-down text-lg cursor-pointer" />
                    <i className="fa-solid fa-share text-lg cursor-pointer hidden md:block" />
                    <i
                      className="fa-solid fa-download text-lg cursor-pointer hidden md:block"
                      onClick={handleDownloadVideo}
                    />                   
                    <i className="fa-solid fa-scissors text-lg cursor-pointer md:block" />
                    <i className="fa-regular fa-bookmark text-lg cursor-pointer hidden md:block" />
                    <Tooltip title={isUserLoggedIn ? 'Save video' : 'Login to save the video'}>
                      <i 
                        className="fa-solid fa-ellipsis text-lg cursor-pointer" 
                        onClick={handleDialogForSaveVideo} 
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mt-4">
                <Input
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Add a comment"
                  fullWidth
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": { height: "100%" },
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "gray",
                    "&::placeholder": { color: "rgba(255, 255, 255, 0.5)" },
                    borderRadius: "4px"
                  }}
                />
                <Button variant="contained" color="primary" onClick={handleAddComment}>
                  Comment
                </Button>
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
                            onChange={(e) => handleContentChange(e.target.value, comment._id)}
                            className='w-full border outline-none px-2'
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={() => setEditingCommentId(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={() => handleEditComment(comment)}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      )}

                      {user === comment.owner._id && editingCommentId !== comment._id && (
                        <div className="flex gap-3">
                          <Tooltip title="Edit">
                            <i 
                              onClick={() => setEditingCommentId(comment._id)} 
                              className="fa-solid fa-pen-to-square cursor-pointer" 
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <i 
                              onClick={() => handleDeleteComment(comment._id)} 
                              className="fa-solid fa-trash cursor-pointer" 
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    <div className="actions flex space-x-4">
                      <Tooltip title="Like">
                        <i
                          onClick={() => handleLikeComment(comment._id)}
                          className="fa-regular fa-thumbs-up text-lg cursor-pointer"
                          style={{ color: likedItems.has(comment._id) ? 'green' : 'inherit' }}
                        />
                      </Tooltip>
                      <Tooltip title="Dislike">
                        <i className="fa-regular fa-thumbs-down text-lg cursor-pointer" />
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <div className="flex flex-col gap-2 w-full mx-1 md:mx-0 md:mt-2">
          {videoData.map((video, index) => (
            <div
              key={video._id || index}
              className="flex w-full rounded-lg overflow-hidden cursor-pointer h-36"
              onClick={() => handleVideoUrl(video)}
            >
              <div className="relative">
                <img
                  className="w-48 h-32 object-cover rounded-lg"
                  src={video.thumbnail}
                  alt="Thumbnail"
                />
                {video.isLive && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    LIVE
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-md font-semibold leading-tight">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.ownerInfo.username}</p>
                <p className="text-xs text-gray-500">
                  {video.views} {video.views <= 1 ? 'view' : 'views'} • {dateAgo(video.createdAt)}
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