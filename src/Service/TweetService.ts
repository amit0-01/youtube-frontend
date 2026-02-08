import { urlRoutes } from "./urlService";
import { apiUrl } from "../../constant";
import api from "../core/api/interceptors/axios";

// GET ALL TWEETS
const getAllTweets = async()=>{
    const Url = `${apiUrl}/${urlRoutes.getAllTweets}`
    const response:any =  await api.get(Url);
    return response.data;
}

// TOOGLE TWEET LIKE
const toggleTweetLikeDisLike = async(tweetId: string) => {
    const Url = `${apiUrl}/${urlRoutes.toggleTweetLikeDisLike}/${tweetId}`
    const response = await api.post(Url, {})
    return response.data
}

// POST TWEET
const postTweet = async(content: any) => {
    const Url = `${apiUrl}/${urlRoutes.postTweet}`
    const response = await api.post(Url, {content})
    return response .data;
}

// GET ALL USER TWEETS

const getAllUserTweets = async (userId: string) => {
    const Url = `${apiUrl}/${urlRoutes.Tweet}/${userId}`
    const response = await api.get(Url)
    return response.data
}

// DELETE USER TWEET 
const deleteTweet = async(tweetId: string) => {
   const Url = `${apiUrl}/${urlRoutes.postTweet}/${tweetId}`
   const response = await api.delete(Url)
   return response.data
}

// EDIT THE TWEET

const EditTweet = async (tweetId: string, content: string) => {    
    const Url = `${apiUrl}/${urlRoutes.postTweet}/${tweetId}`
    const response = await api.patch(Url, {content})
    return response.data;

}

export {getAllTweets, toggleTweetLikeDisLike, postTweet, getAllUserTweets, deleteTweet, EditTweet}