import React, { useEffect, useState } from 'react';
import { VideoUploadFormProps } from '../../interface/interface';
import { uploadVideo } from '../../Service/YoutubeService';

function VideoUploadForm({ toggleForm,setLoading }: VideoUploadFormProps) {
  const [token, setToken] = useState('');
  const [userId,setUserId] = useState('');
  // const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    // Retrieve the stored userInfo from local storage
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      try {
        // Parse the stored userData
        const parsedData = JSON.parse(userData);

        // Set the token and userId from parsedData
        if (parsedData.accessToken) {
          setToken(parsedData.accessToken);          
        }

        if (parsedData.user) {
          console.log(parsedData);
          
          setUserId(parsedData.user._id);
          
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    } else {
      console.warn('No user data found in localStorage.');
    }
  }, []);
  
  const [formValues, setFormValues] = useState({
    title: '',
    videoFile: null as File | null,
    thumbnail: null as File | null,
    description: '',
    duration: '' // Added duration field
  });

  // Handle change events for form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;

    if (name === 'videoFile' || name === 'thumbnail') {
      // Handle file input
      if (files) {
        const file = files[0];
        setFormValues(prev => ({ ...prev, [name]: file }));
        if (name === 'videoFile') {
          calculateVideoDuration(file);
        }
      }
    } else {
      // Handle text input
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };

  // Calculate video duration
  const calculateVideoDuration = (file: File) => {
    const videoElement = document.createElement('video');
    const objectURL = URL.createObjectURL(file);

    videoElement.addEventListener('loadedmetadata', () => {
      console.log(videoElement);
      
      const duration = videoElement.duration;
      console.log('Video Duration:', duration);
      setFormValues(prev => ({ ...prev, duration: duration.toFixed(2) })); // Set duration with 2 decimal places
      URL.revokeObjectURL(objectURL); // Clean up URL object
    });

    videoElement.src = objectURL;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    uploadVideo(formValues, token, userId).then((res: any) => {
      if (res.success) {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error uploading video:', error);
      setLoading(false); // Ensure loading is reset on error as well
    });

    toggleForm();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Upload Video</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Video Title"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <p className='mb-2'>Upload Video</p>
          <input
            type="file"
            name="videoFile"
            onChange={handleChange}
            className="w-full mb-4"
          />
          <p className='mb-2'>Upload Thumbnail</p>
          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
            className='w-full mb-4'
          />
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Video Description"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          ></textarea>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Duration (in seconds)</label>
            <input
              type="text"
              value={formValues.duration}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleForm}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VideoUploadForm;
