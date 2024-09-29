// src/components/AddToPlaylistDialog.js
import React, { useEffect, useState } from 'react';
import { Checkbox, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getPlaylist, createPlaylist, addVideotoPlaylist, removeVideofromPlaylist } from '../../Service/AddtoPlaylist';
import Loader from '../Loader';

interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: any[];
}

interface AddToPlaylistDialogProps {
  videoId: string;
  open: boolean;
  onClose: () => void;
}

const AddToPlaylistDialog: React.FC<AddToPlaylistDialogProps> = ({ videoId, open, onClose }) => {
  const [userPlaylist, setUserPlaylist] = useState<Playlist[]>([]);
  const [showFormForCreateList, setShowFormForCreateList] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const userDataString = localStorage.getItem('userInfo');
    if (userDataString !== null) {
      const userData = JSON.parse(userDataString);
      setUserId(userData.user._id);
      setToken(userData.accessToken);
    }
  }, []);

  useEffect(() => {
    // Only fetch the playlist when userId and token are set
    if (userId && token) {
      fetchUserPlaylist();
    }
  }, [userId, token]);


  const fetchUserPlaylist = async () => {
    try {
      setLoading(true);
      const res = await getPlaylist(token, userId);
      if (res.success) {
        setUserPlaylist(res.data);
      }
    } catch (error) {
      console.error('Error fetching playlist:', error);
    } finally{
      setLoading(false);
    }
  };

  const handleAddPlaylist = async () => {
    try {
      const res = await createPlaylist(token, playlistName, playlistDescription);
      if (res.success) {
        fetchUserPlaylist(); // Refresh playlist after creation
        setPlaylistName('');
        setPlaylistDescription('');
        setShowFormForCreateList(false);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleCheckboxChange = async (playlist: Playlist, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const obj = {
      playlistId: playlist._id,
      videoId,
      token,
    };

    try {
      if (isChecked) {
        const res = await addVideotoPlaylist(obj);
        if (res.success) {
          alert(res.message);
        }
      } else {
        const res = await removeVideofromPlaylist(obj);
        if (res.success) {
          alert(res.message);
        }
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const isVideoInPlaylist = (playlist: Playlist) => {    
    return playlist.videos.some((video: any) => video._id === videoId);
  };

  return (
    <> 
    { loading? (
      <Loader/>
    ) : (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Video to Playlist</DialogTitle>
      <DialogContent>
        {userPlaylist.map((playlist) => (
          <div key={playlist._id}>
            <Checkbox
              checked={isVideoInPlaylist(playlist)}
              onChange={(event) => handleCheckboxChange(playlist, event)}
            />
            {playlist.name}
          </div>
        ))}
        {!showFormForCreateList && (
          <div onClick={() => setShowFormForCreateList(true)} className="cursor-pointer">
            <Button startIcon={<i className="fa-solid fa-plus"></i>}>Create new playlist</Button>
          </div>
        )}
        {showFormForCreateList && (
          <div className="flex flex-col space-y-4">
            <TextField
              label="New Playlist Name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Playlist Description"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <Button onClick={handleAddPlaylist} variant="contained" color="primary">
              Create Playlist
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
    )
}
    </>
  );
};

export default AddToPlaylistDialog;
