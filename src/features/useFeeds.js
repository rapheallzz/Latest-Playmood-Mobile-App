import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BASE_API_URL from '../apiConfig';

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
    if (!user) {
      throw new Error('User not authenticated');
    }

    // 1. Get signature from your server
    const signatureResponse = await api.get('/api/content/signature');
    const { signature, timestamp, folder, api_key } = signatureResponse.data;

    // 2. Upload files to Cloudinary
    const uploadPromises = mediaFiles.map(file => {
      const resourceType = file.mimeType.startsWith('video') ? 'video' : 'image';
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dcsdrpkeh/${resourceType}/upload`;

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.fileName,
        type: file.mimeType,
      });
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      return axios.post(cloudinaryUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(response => ({
        ...response.data,
        type: resourceType,
      }));
    });

    const cloudinaryResponses = await Promise.all(uploadPromises);

    // 3. Create feed post on your server
    const media = cloudinaryResponses.map(res => ({
      url: res.secure_url,
      public_id: res.public_id,
      type: res.type,
    }));

    const postType = media.length > 0 ? media[0].type : 'image';

    const response = await api.post('/api/feed', {
      caption,
      media,
      type: postType,
    });

    await fetchFeeds(); // Refresh feeds after successful post
    return response.data; // Return response data to the component
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
