import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BASE_API_URL, { CLOUDINARY_CLOUD_NAME } from '../apiConfig';

const useFeeds = (user, creatorId = null) => {
  const [feeds, setFeeds] = useState([]);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: BASE_API_URL,
    headers: {
      Authorization: `Bearer ${user?.token}`,
      'Content-Type': 'application/json',
    },
  });

  const fetchFeeds = useCallback(async () => {
    const userIdToFetch = creatorId || user?._id;
    if (!userIdToFetch) return;

    setIsLoadingFeeds(true);
    setError(null);
    try {
      const response = await api.get(`/api/feed/user/${userIdToFetch}`);
      setFeeds(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feeds.');
    } finally {
      setIsLoadingFeeds(false);
    }
  }, [user?._id, creatorId]);

  const createFeedPost = async (caption, mediaFiles) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // 1. Get signature from your server
      const signatureResponse = await api.post('/api/content/signature', { type: 'images' });
      const { signature, timestamp, api_key } = signatureResponse.data;

      // 2. Upload files to Cloudinary
      const uploadPromises = mediaFiles.map(file => {
        const resourceType = file.mimeType.startsWith('video') ? 'video' : 'image';
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.fileName,
          type: file.mimeType,
        });
        formData.append('api_key', api_key);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);

        return axios.post(cloudinaryUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(response => ({
          url: response.data.secure_url,
          public_id: response.data.public_id,
        }));
      });

      const uploadedMedia = await Promise.all(uploadPromises);

      // 3. Create feed post on your server
      const postData = {
        caption,
        type: 'image',
        media: uploadedMedia,
      };

      const response = await api.post('/api/feed', postData);

      await fetchFeeds(); // Refresh feeds after successful post
      return response.data; // Return response data to the component
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  return {
    feeds,
    isLoadingFeeds,
    error,
    fetchFeeds,
    createFeedPost,
  };
};

export default useFeeds;
