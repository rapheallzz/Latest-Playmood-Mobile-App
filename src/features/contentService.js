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

const addVideoToPlaylist = async (playlistId, contentId, token) => {
  const response = await axios.post(
    `${API_URL}/playlists/${playlistId}/videos/${contentId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const updatePlaylist = async (playlistId, playlistData, token) => {
  const response = await axios.put(
    `${API_URL}/playlists/${playlistId}`,
    playlistData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const deletePlaylist = async (playlistId, token) => {
  const response = await axios.delete(`${API_URL}/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateCommunityPost = async (postId, content, token) => {
  const response = await axios.put(
    `${API_URL}/community/${postId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const deleteCommunityPost = async (postId, token) => {
  const response = await axios.delete(`${API_URL}/community/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteCommunityComment = async (postId, commentId, token) => {
  const response = await axios.delete(
    `${API_URL}/community/${postId}/comment/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {
  fetchContent,
  addToFavorites,
  addToWatchlist,
  likeContent,
  fetchLikedContent,
  fetchFriends,
  addVideoToPlaylist,
  updatePlaylist,
  deletePlaylist,
  updateCommunityPost,
  deleteCommunityPost,
  deleteCommunityComment,
};
