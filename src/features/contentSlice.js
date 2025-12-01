import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from './contentService.js';

export const fetchContent = createAsyncThunk('content/fetchContent', async (_, thunkAPI) => {
  try {
    const response = await contentService.fetchContent();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const addToFavorites = createAsyncThunk('content/addToFavorites', async (contentId, thunkAPI) => {
  try {
    const response = await contentService.addToFavorites(contentId);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const addToWatchlist = createAsyncThunk('content/addToWatchlist', async (contentId, thunkAPI) => {
  try {
    const response = await contentService.addToWatchlist(contentId);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const likeContent = createAsyncThunk('content/likeContent', async (contentId, thunkAPI) => {
  try {
    const response = await contentService.likeContent(contentId);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchLikedContent = createAsyncThunk('content/fetchLikedContent', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.userToken;
    const response = await contentService.fetchLikedContent(token);
    return response.data.likedContents;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchFriends = createAsyncThunk('content/fetchFriends', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.userToken;
    const response = await contentService.fetchFriends(token);
    return response.data.friends;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const unlikeContent = createAsyncThunk('content/unlikeContent', async (contentId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.userToken;
        const response = await contentService.unlikeContent(contentId, token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const fetchContentComments = createAsyncThunk('content/fetchContentComments', async (contentId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.userToken;
        const response = await contentService.fetchContentComments(contentId, token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const commentOnContent = createAsyncThunk('content/commentOnContent', async ({ contentId, comment }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.userToken;
        const response = await contentService.commentOnContent(contentId, comment, token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    contentList: [],
    favorites: [],
    watchlist: [],
    likes: [],
    comments: [],
    friends: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contentList = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites.push(action.payload);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToWatchlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watchlist.push(action.payload);
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(likeContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likeContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likes.push(action.payload);
        const index = state.contentList.findIndex((content) => content._id === action.payload.contentId);
        if (index !== -1) {
          state.contentList[index].likesCount++;
          state.contentList[index].isLiked = true;
        }
      })
      .addCase(likeContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchLikedContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLikedContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likes = action.payload;
      })
      .addCase(fetchLikedContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(unlikeContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unlikeContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likes = state.likes.filter((id) => id !== action.payload.contentId);
        const index = state.contentList.findIndex((content) => content._id === action.payload.contentId);
        if (index !== -1) {
          state.contentList[index].likesCount--;
          state.contentList[index].isLiked = false;
        }
      })
      .addCase(unlikeContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchContentComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchContentComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchContentComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(commentOnContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(commentOnContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload);
      })
      .addCase(commentOnContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default contentSlice.reducer;
