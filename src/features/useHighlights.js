import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BASE_API_URL from '../apiConfig';

const useHighlights = (user, creatorId) => {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHighlights = useCallback(async () => {
    const idToFetch = creatorId || user?._id;
    if (!idToFetch) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/highlights/creator/${idToFetch}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      setHighlights(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch highlights.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id, creatorId]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const createHighlight = async (highlightData) => {
    if (!user?._id || !user.token) {
      setError('User not authenticated.');
      return { success: false };
    }
    setIsLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        `${BASE_API_URL}/api/highlights`,
        {
          ...highlightData,
          creatorId: user._id,
        },
        config
      );
      setHighlights((prev) => [...prev, response.data]);
      setIsLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create highlight.';
      setError(errorMessage);
      console.error(err);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return { highlights, isLoading, error, createHighlight, fetchHighlights };
};

export default useHighlights;
