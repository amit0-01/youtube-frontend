import { useEffect, useState } from 'react';
import { dateAgo } from '../Service/Function';
import { deleteTweet, EditTweet, getAllUserTweets } from '../Service/TweetService';
import { Input, Tooltip, IconButton } from '@mui/material';
import WarningDialog from '../common/Warning';
import Loader from './Loader';
import { toast } from 'react-toastify';

function MyTweets() {
  const [tweets, setTweets] = useState<any>([]);
  const [user, setUser] = useState<any>();
  const [editTweetId, setEditTweetId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tweetToDelete, setTweetToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (userData && userData.user) {
      setUser(userData);
    } else {
      toast.error('No user data found');
    }
  }, []);

  const getUserTweets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await getAllUserTweets(user?.user._id);
      if (response.success) setTweets(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTweets();
  }, [user]);

  const handleDelete = async (tweetId: string) => {
    setLoading(true);
    const response = await deleteTweet(tweetId);
    if (response.success) {
      toast.success("Tweet deleted");
      getUserTweets();
    }
    setLoading(false);
  };

  const handleContentChange = (e: any, tweetId: string) => {
    const updatedTweets = tweets.map((tweet: any) =>
      tweet._id === tweetId ? { ...tweet, content: e.target.value } : tweet
    );
    setTweets(updatedTweets);
  };

  const handleEdit = async (tweetId: string) => {
    const tweetToEdit = tweets.find((tweet: any) => tweet._id === tweetId);
    if (tweetToEdit) {
      const response = await EditTweet(tweetId, tweetToEdit.content);
      if (response.success) {
        toast.success(response.message);
        setEditTweetId(null);
        getUserTweets();
      }
    }
  };

  const handleOpenDialog = (tweetId: string) => {
    setTweetToDelete(tweetId);
    setOpenDialog(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {tweets?.length > 0 ? (
            tweets.map((tweet: any) => (
              <div 
                key={tweet._id} 
                className={`bg-white border border-gray-200 rounded-xl p-4 transition-all hover:shadow-md ${
                  editTweetId === tweet._id ? "ring-2 ring-blue-400 border-transparent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar Placeholder */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                    {tweet.owner?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 truncate hover:underline cursor-pointer">
                          {tweet.owner?.username || 'User'}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          · {dateAgo(tweet.createdAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {editTweetId !== tweet._id ? (
                          <>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => setEditTweetId(tweet._id)} className="hover:text-blue-600">
                                <i className="fa-solid fa-pen-to-square text-sm"></i>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleOpenDialog(tweet._id)} className="hover:text-red-600">
                                <i className="fa-solid fa-trash text-sm"></i>
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title="Save Changes">
                            <button 
                              onClick={() => handleEdit(tweet._id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                            >
                              Save
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="mt-2 text-gray-800 leading-relaxed">
                      {editTweetId !== tweet._id ? (
                        <p className="whitespace-pre-wrap">{tweet.content}</p>
                      ) : (
                        <Input
                          multiline
                          fullWidth
                          value={tweet.content}
                          onChange={(e) => handleContentChange(e, tweet._id)}
                          className="mt-1 bg-gray-50 p-2 rounded-lg"
                          disableUnderline
                          autoFocus
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <i className="fa-solid fa-feather-pointed text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500 font-medium">No tweets to show yet.</p>
            </div>
          )}
        </div>
      )}

      <WarningDialog
        open={openDialog}
        title="Delete Tweet?"
        content="This can’t be undone and it will be removed from your profile."
        onConfirm={() => {
          if (tweetToDelete) handleDelete(tweetToDelete);
          setOpenDialog(false);
        }}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
}

export default MyTweets;