import axios from "axios";
import { urlRoutes } from "./urlService";
import { apiUrl } from "../../constant";


// GET ALL TWEETS
const getAllTweets = async()=>{
    const Url = `${apiUrl}/${urlRoutes.getAllTweets}`
    const response:any =  await axios.get(Url);
    return response.data;
}


// TOOGLE TWEET LIKE
const toggleTweetLikeDisLike = async(tweetId:string, token: string) =>{
    const Url = `${apiUrl}/${urlRoutes.toggleTweetLikeDisLike}/${tweetId}`
    const config = {
        headers: {
            Authorization : `Bearer ${token}`
        }
    }
    const response = await axios.post(Url, {}, config)
    return response.data
}

// POST TWEET
const postTweet = async(content: any, token: string)=>{
    const Url = `${apiUrl}/${urlRoutes.postTweet}`
    const config = {
        headers: {
            Authorization : `Bearer ${token}`
        }
    }
    const response = await axios.post(Url, {content}, config)
    return response .data;
}

// GET ALL USER TWEETS

const getAllUserTweets = async (token:string, userId:string)=>{
    const Url = `${apiUrl}/${urlRoutes.Tweet}/${userId}`
    const config = {
        headers: {
            Authorization : `Bearer ${token}`
        }
    }
    const response = await axios.get(Url,config)
    return response.data
}

// DELETE USER TWEET 
const deleteTweet = async(tweetId:string, token: string)=>{
   const Url = `${apiUrl}/${urlRoutes.postTweet}/${tweetId}`
   const config = {
    headers: {
        Authorization : `Bearer ${token}`
    }
}
    const response = await axios.delete(Url,config)
    return response.data
}

// EDIT THE TWEET

const EditTweet = async (tweetId: string, content: string ,token: string) =>{    
    const Url = `${apiUrl}/${urlRoutes.postTweet}/${tweetId}`
    const config = {
        headers: {
            Authorization : `Bearer ${token}`
        }
    }
    const response = await axios.patch(Url,{content}, config)
    return response.data;

}


export {getAllTweets, toggleTweetLikeDisLike, postTweet, getAllUserTweets, deleteTweet, EditTweet}