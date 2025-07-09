import { useEffect, useState } from 'react'
import { getAllTweets, postTweet, toggleTweetLikeDisLike } from '../Service/TweetService';
import { dateAgo } from '../Service/Function';
import Loader from './Loader';
import { Tooltip } from '@mui/material';
import { toast } from 'react-toastify';


function Tweets() {

    const [tweets, setTweets] = useState([]);
  const [tweetContent, setTweetContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<any>(null);

  // FETCH ALL TWEETS
  const fetchAllTweets = async () => {
    try {
      setLoading(true);
      const allTweets = await getAllTweets();
      setTweets(allTweets.statusCode.data.tweets);
    } catch (error:any) {
      toast.error("Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTweets();

    // FETCH USER DATA
    const userData = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (userData && userData.user) {
      setUser(userData.user);
      setToken(userData.accessToken);
    }
  }, []);

  // TOGGLE LIKE AND DISLIKE
  const handleLikeTweet = async (tweetId: string) => {
    if(!token){
      toast.error("Login to Like tweet")
      return;
    }
    try {
      const response = await toggleTweetLikeDisLike(tweetId, token);
      toast.success(response.message);
      fetchAllTweets();
    } catch (error:any) {
      toast.error("Error toggling like/dislike:", error);
    }
  };

  // POST TWEET
  const handlePostTweet = async () => {
    if (!tweetContent) {
      toast.error("Tweet content cannot be empty");
      return;
    }

    if(!token){
      toast.error('Login to Tweet');
      return;
    }

    try {
      await postTweet(tweetContent, token);
      toast.success("Tweet posted successfully!");
      setTweetContent("");
      fetchAllTweets(); 
    } catch (error) {
      toast.error("Failed to post tweet");
    }
  };


  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* INPUT BOX FOR TWEET */}
          <div className="bg-white p-4 rounded-xl shadow-lg mb-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.coverImage ||
                  'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'
                }
                alt="User"
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
              <input
                type="text"
                placeholder="What's happening?!"
                className="flex-grow bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onChange={(e) => setTweetContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white rounded-full px-6 py-2 font-medium hover:bg-blue-700 transition-all duration-200"
                onClick={handlePostTweet}
              >
                Post
              </button>
            </div>
          </div>

          {/* ALL TWEETS DIVS */}
          <div className="space-y-4">
            {tweets?.length > 0 ? (
              tweets.map((tweet:any) => (
                <div
                  key={tweet._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tweet.owner?.coverImage || 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'}
                      alt="User"
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        {tweet.owner?.username || 'Unknown User'}
                      </h2>
                      <p className="text-xs text-gray-500">{dateAgo(tweet.createdAt)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-800 leading-relaxed">{tweet.content}</p>
                  <div className="flex justify-between items-center mt-4 text-gray-500">
                    <div className="flex items-center gap-4">
                      <Tooltip title={token ? 'Like Tweet' : 'Login to Like Tweet'} arrow>
                        <span className="cursor-pointer flex items-center gap-1">
                          <i
                            className={`fa-solid fa-thumbs-up text-lg hover:text-blue-500 transition-colors duration-200`}
                            onClick={() => handleLikeTweet(tweet._id)}
                          />
                        </span>
                      </Tooltip>
                      <Tooltip title={token ? 'Dislike Tweet' : 'Login to Dislike Tweet'} arrow>
                        <span className="cursor-pointer flex items-center gap-1">
                          <i className="fa-solid fa-thumbs-down text-lg hover:text-red-500 transition-colors duration-200" />
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No tweets available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
  


}

export default Tweets