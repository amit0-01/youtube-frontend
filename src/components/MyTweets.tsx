import { useEffect, useState } from 'react'
import { dateAgo } from '../Service/Function'
import { deleteTweet, EditTweet, getAllUserTweets } from '../Service/TweetService';
import {Input, Tooltip } from '@mui/material';
import WarningDialog from '../common/Warning';
import Loader from './Loader';
function MyTweets() {

    const[tweets, setTweets] = useState<any>([]);
    const [user, setUser] = useState<any>();
    const [editTweetId, setEditTweetId] = useState<string | null>(null); // Track the currently editing tweet
    const [openDialog, setOpenDialog] = useState(false);
    const [tweetToDelete, setTweetToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // GETCH USER DATA
    useEffect(() => {
        // FETCH USER DATA
        const userData = JSON.parse(localStorage.getItem("userInfo") || "{}");
        
        if (userData && userData.user) {
          setUser(userData);
        } else {
          console.log('No user data found in localStorage');
        }
      }, []);


    // GET USER TWEET FUNCTION

    const getUserTweets = async()=>{
      setLoading(true);
      if(user){
      const response = await getAllUserTweets(user?.accessToken, user?.user._id)
      if(response.success){
          setTweets(response.data)
          setLoading(false);
      }
    }
  }


    // GET USER TWEETS WHEN COMPONETN IS INITLISED
    useEffect(()=>{
      getUserTweets();
    },[user])

    // DELTE THE TWEET
    const handleDelete = async(tweetId:string)=>{
      setLoading(true);
     const response = await deleteTweet(tweetId, user.accessToken)
     if(response.success){
      getUserTweets();
      setLoading(false);
     }
     
    }
  // CHANGE THE CONTENT WHEN TYPING
  const handleContentChange = (e: any, tweetId: string) => {
    const updatedTweets = tweets.map((tweet: any) =>
      tweet._id === tweetId ? { ...tweet, content: e.target.value } : tweet
    );
    setTweets(updatedTweets);
  };

  // EDIT TWEET 
  const handleEdit = async (tweetId: string) => {
    const tweetToEdit = tweets.find((tweet: any) => tweet._id === tweetId);
  
    if (tweetToEdit) {
      const response = await EditTweet(tweetId, tweetToEdit.content, user.accessToken);
      console.log(response);
      
      getUserTweets(); 
      setEditTweetId(null);
    } else {
      console.error('Tweet not found');
    }
  };

  // OPEN DIALOG FOR DELETE
  const handleOpenDialog = (tweetId: string) => {
    setTweetToDelete(tweetId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (tweetToDelete) {
      handleDelete(tweetToDelete);
      setTweetToDelete(null);
    }
    setOpenDialog(false);
  };
   
  const handleCloseDialog = () => {
    setTweetToDelete(null);
    setOpenDialog(false);
  };
  

  return (
    <>
    { loading ? (<Loader/>) :(
    <div>
      {tweets?.length > 0 ? (
        tweets.map((tweet: any) => (
          <div key={tweet._id} className=" bg-gray-800 p-3  w-full mt-4">
            <div className="flex  justify-between">
              <h2 className="text-white font-bold">{tweet.owner?.username || 'Unknown User'}</h2>
              <div>
                {editTweetId !== tweet._id ? (
                  <>
                    <Tooltip title="Delete" arrow>
                      <span className="cursor-pointer me-2">
                      <i className="fa-solid fa-trash" onClick={() => handleOpenDialog(tweet._id)}></i>
                      </span>
                    </Tooltip>

                    <WarningDialog
        open={openDialog}
        title="Confirm Deletion"
        content="Are you sure you want to delete this tweet?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDialog}
      />

                    <Tooltip title="Edit" arrow>
                      <span className="cursor-pointer">
                        <i className="fa-solid fa-pen-to-square" onClick={() => setEditTweetId(tweet._id)}></i>
                      </span>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Save" arrow>
                      <span className="cursor-pointer">
                        <i className="fa-solid fa-check" onClick={() => handleEdit(tweet._id)}></i>
                      </span>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-400 text-sm">{dateAgo(tweet.createdAt)}</p>
            {editTweetId !== tweet._id ? (
              <p className="text-gray-200 mt-2">{tweet.content}</p>
            ) : (
              <Input
                value={tweet.content}
                onChange={(e) => handleContentChange(e, tweet._id)}
                className="mt-2 w-full"
              />
            )}
          </div>
        ))
      ) : (
        <p>No tweets found.</p>
      )}
    </div>
    )
    }
    </>
  );
}

export default MyTweets