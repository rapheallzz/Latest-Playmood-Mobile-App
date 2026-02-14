import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BASE_API_URL from '../apiConfig';
import uploadService from './uploadService';

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

      // 1. Upload files to Cloudflare R2
      const uploadPromises = mediaFiles.map(async (file) => {
        // Get signature for each file as R2 presigned URLs are usually key-specific
        const signatureFormData = new FormData();
        signatureFormData.append('provider', 'r2');
        signatureFormData.append('fileName', file.fileName || (file.mimeType.startsWith('video') ? 'video.mp4' : 'image.jpg'));
        signatureFormData.append('contentType', file.mimeType);

        const signatureResponse = await api.post('/api/content/signature', signatureFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const { uploadUrl, key, publicUrl } = signatureResponse.data;

        await uploadService.uploadToR2(
          file.uri,
          uploadUrl,
          file.mimeType,
          null // Not tracking individual progress for feed media here
        );

        return {
          url: publicUrl || uploadUrl,
          key: key,
        };
      });

      const uploadedMedia = await Promise.all(uploadPromises);

      // 2. Create feed post on your server
      const postData = {
        caption,
        type: 'image', // Assuming 'image' type still applies even if it contains videos in media array, as per old code
        media: uploadedMedia,
      };

      const response = await api.post('/api/feed', postData);

      await fetchFeeds(); // Refresh feeds after successful post
      return response.data; // Return response data to the component
    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
      } else {
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
