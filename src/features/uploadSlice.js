import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_API_URL, { CLOUDINARY_CLOUD_NAME } from '../apiConfig';

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async ({ videoFile, thumbnailFile, videoMetadata, previewStart, previewEnd }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.userToken;

    if (!token) {
      return rejectWithValue('User not authenticated');
    }

    try {
      const api = axios.create({
        baseURL: BASE_API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // 1. Get signature for video
      const videoSigResponse = await api.post('/api/content/signature', { type: 'videos' });
      const videoSigData = videoSigResponse.data;

      // 2. Upload video to Cloudinary
      const uploadToCloudinary = async (asset, sigData, resourceType) => {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          name: asset.fileName,
          type: asset.mimeType,
        });
        formData.append('api_key', sigData.api_key);
        formData.append('timestamp', sigData.timestamp);
        formData.append('signature', sigData.signature);

        const response = await axios.post(cloudinaryUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      };

      const videoUploadResponse = await uploadToCloudinary(videoFile, videoSigData, 'video');

      // 3. Handle thumbnail upload
      let thumbnailUploadResponse = null;
      if (thumbnailFile) {
        const thumbSigResponse = await api.post('/api/content/signature', { type: 'images' });
        const thumbSigData = thumbSigResponse.data;
        thumbnailUploadResponse = await uploadToCloudinary(thumbnailFile, thumbSigData, 'image');
      }

      // 4. Construct the final payload
      const finalPayload = {
        ...videoMetadata,
        userId: auth.user._id,
        previewStart,
        previewEnd,
        languageCode: 'en-US',
        video: {
          public_id: videoUploadResponse.public_id,
          url: videoUploadResponse.secure_url,
        },
        ...(thumbnailUploadResponse && {
          thumbnail: {
            public_id: thumbnailUploadResponse.public_id,
            url: thumbnailUploadResponse.secure_url,
          },
        }),
      };

      // 5. Post the final payload to your server
      const response = await api.post('/api/content', finalPayload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  isUploading: false,
  uploadProgress: 0,
  error: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.isUploading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
      });
  },
});

export default uploadSlice.reducer;
