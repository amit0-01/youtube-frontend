import React, { useEffect, useState } from 'react'
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
      console.log("allTweets", allTweets.statusCode.data.tweets);
      setTweets(allTweets.statusCode.data.tweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
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
    console.log("tweetid", tweetId);
    try {
      const response = await toggleTweetLikeDisLike(tweetId, token);
      console.log("toggleLikeResponse", response);
      toast.success(response.message);
      fetchAllTweets(); // Refresh tweets after toggling like/dislike
    } catch (error) {
      console.error("Error toggling like/dislike:", error);
    }
  };

  // POST TWEET
  const handlePostTweet = async () => {
    if (!tweetContent) {
      toast.error("Tweet content cannot be empty");
      return;
    }

    try {
      const response = await postTweet(tweetContent, token);
      console.log("response", response);
      toast.success("Tweet posted successfully!");
      setTweetContent(""); // Clear input after posting
      fetchAllTweets(); // Refresh tweets after posting
    } catch (error) {
      console.error("Error posting tweet:", error);
      toast.error("Failed to post tweet");
    }
  };


    return (
        <div className="p-3">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {/* INPUT BOX FOR TWEET */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <img
                                src={user?.coverImage}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <input
                                type="text"
                                placeholder="What is happening?!"
                                className="flex-grow ml-3 bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                onChange={(e)=>setTweetContent(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end items-center mt-3">
                            <button className="bg-blue-500 text-white rounded-full px-4 py-1"
                            onClick={handlePostTweet}
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    {/* ALL TWEETS DIVS */}
                    <div>
                        {tweets?.length > 0 ? (
                            tweets.map((tweet: any) => (
                                <div key={tweet.id} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 mt-1">
                                    <div className="flex items-center">
                                        <img
                                            src={tweet.owner?.coverImage || 'defaultImageURL'} // Use a default image if coverImage is not available
                                            alt="User"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="ml-3">
                                            <h2 className="text-white font-bold">{tweet.owner?.username || 'Unknown User'}</h2>
                                            <p className="text-gray-400 text-sm">{dateAgo(tweet.createdAt)}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-200 mt-2">{tweet.content}</p>
                                    <div className="flex justify-between items-center mt-2 text-gray-400">
                                        <div className="flex items-center">
                                        <Tooltip title="Like Tweet" arrow>
                                            <span className="cursor-pointer">
                                                <i
                                                className="fa-solid fa-thumbs-up"
                                                onClick={() => handleLikeTweet(tweet._id)}
                                                ></i>
                                            </span>
                                            </Tooltip>

                                            <Tooltip title="Dislike Tweet" arrow>
                                                <span className="cursor-pointer ml-3">
                                                    <i className="fa-solid fa-thumbs-down"></i>
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No tweets available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );


}

export default Tweets