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
    if (!user) return;
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      mediaFiles.forEach((file) => {
        formData.append('media', {
          uri: file.uri,
          name: file.fileName,
          type: file.mimeType,
        });
      });

      const response = await api.post('/api/feed/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFeeds([response.data, ...feeds]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create feed post.');
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
