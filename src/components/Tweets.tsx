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
  <div className="p-4 md:p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    ) : (
      <>
        {/* INPUT BOX FOR TWEET */}
        <div className="bg-white p-5 rounded-2xl shadow-md mb-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-start gap-4">
            <img
              src={
                user?.coverImage ||
                'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'
              }
              alt="User"
              className="w-12 h-12 rounded-full border border-gray-300 object-cover"
            />

            <input
              type="text"
              placeholder="What's happening?!"
              className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              onChange={(e) => setTweetContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm"
              onClick={handlePostTweet}
            >
              Post
            </button>
          </div>
        </div>

        {/* ALL TWEETS DIVS */}
        <div className="space-y-5">
          {tweets?.length > 0 ? (
            tweets.map((tweet: any) => (
              <div
                key={tweet._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      tweet.owner?.coverImage ||
                      'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'
                    }
                    alt="User"
                    className="w-11 h-11 rounded-full border border-gray-300 object-cover"
                  />

                  <div className="flex flex-col">
                    <h2 className="text-sm font-semibold text-gray-900 leading-none">
                      {tweet.owner?.username || 'Unknown User'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {dateAgo(tweet.createdAt)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-gray-800 text-sm leading-relaxed">
                  {tweet.content}
                </p>

                <div className="flex justify-between items-center mt-5 text-gray-500">
                  <div className="flex items-center gap-6">
                    <Tooltip title={token ? 'Like Tweet' : 'Login to Like Tweet'} arrow>
                      <span className="cursor-pointer flex items-center gap-2 group">
                        <i
                          className="fa-solid fa-thumbs-up text-lg group-hover:text-blue-600 transition-colors duration-200"
                          onClick={() => handleLikeTweet(tweet._id)}
                        />
                      </span>
                    </Tooltip>

                    <Tooltip title={token ? 'Dislike Tweet' : 'Login to Dislike Tweet'} arrow>
                      <span className="cursor-pointer flex items-center gap-2 group">
                        <i className="fa-solid fa-thumbs-down text-lg group-hover:text-red-500 transition-colors duration-200" />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-10 text-sm">
              No tweets available.
            </p>
          )}
        </div>
      </>
    )}
  </div>
);


  


}

export default Tweets