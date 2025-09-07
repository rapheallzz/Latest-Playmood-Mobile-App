import axios from 'axios';

const API_URL = 'https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api';

const fetchContent = async () => {
  const response = await axios.get(`${API_URL}/content`);
  return response;
};

const addToFavorites = async (contentId, userId) => {
  const response = await axios.post(`${API_URL}/favorites`, { contentId, userId });
  return response;
};

const addToWatchlist = async (contentId) => {
  const response = await axios.post(`${API_URL}/watchlist`, { contentId });
  return response;
};

const likeContent = async (contentId, userId) => {
  const response = await axios.post(`${API_URL}/like/`, { contentId, userId });
  return response;
};

const fetchLikedContent = async (token) => {
  const response = await axios.get(`${API_URL}/users/likes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const fetchFriends = async (token) => {
  const response = await axios.get(`${API_URL}/users/friends`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export default {
  fetchContent,
  addToFavorites,
  addToWatchlist,
  likeContent,
  fetchLikedContent,
  fetchFriends,
};
