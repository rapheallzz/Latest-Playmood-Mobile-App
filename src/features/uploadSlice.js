import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_API_URL from '../apiConfig';
import uploadService from './uploadService';

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async ({ videoFile, thumbnailFile, videoMetadata, previewStart, previewEnd }, thunkAPI) => {
    const { auth } = thunkAPI.getState();
    const token = auth.userToken;

    if (!token) {
      return thunkAPI.rejectWithValue('User not authenticated');
    }

    try {
      const api = axios.create({
        baseURL: BASE_API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 1. Get signature for video
      const videoSignatureFormData = new FormData();
      videoSignatureFormData.append('provider', 'r2');
      videoSignatureFormData.append('fileName', videoFile.fileName || 'video.mp4');
      videoSignatureFormData.append('contentType', videoFile.mimeType || 'video/mp4');

      const videoSigResponse = await api.post('/api/content/signature', videoSignatureFormData);
      const { uploadUrl: videoUploadUrl, key: videoKey, publicUrl: videoPublicUrl } = videoSigResponse.data;

      // 2. Upload video to Cloudflare R2
      await uploadService.uploadToR2(
        videoFile.uri,
        videoUploadUrl,
        videoFile.mimeType || 'video/mp4',
        (progress) => {
          thunkAPI.dispatch(updateUploadProgress(progress));
        }
      );

      // 3. Handle thumbnail upload
      let thumbnailData = null;
      if (thumbnailFile) {
        const thumbSignatureFormData = new FormData();
        thumbSignatureFormData.append('provider', 'r2');
        thumbSignatureFormData.append('fileName', thumbnailFile.fileName || 'thumbnail.jpg');
        thumbSignatureFormData.append('contentType', thumbnailFile.mimeType || 'image/jpeg');

        const thumbSigResponse = await api.post('/api/content/signature', thumbSignatureFormData);
        const { uploadUrl: thumbUploadUrl, key: thumbKey, publicUrl: thumbPublicUrl } = thumbSigResponse.data;

        await uploadService.uploadToR2(
          thumbnailFile.uri,
          thumbUploadUrl,
          thumbnailFile.mimeType || 'image/jpeg',
          null // Not tracking thumbnail progress separately
        );

        thumbnailData = {
          url: thumbPublicUrl || thumbUploadUrl,
          key: thumbKey,
        };
      }

      // 4. Construct the final payload
      const finalPayload = {
        ...videoMetadata,
        userId: auth.user._id,
        previewStart,
        previewEnd,
        languageCode: 'en-US',
        video: {
          url: videoPublicUrl || videoUploadUrl,
          key: videoKey,
        },
        ...(thumbnailData && {
          thumbnail: thumbnailData,
        }),
      };

      // 5. Post the final payload to your server
      console.log('Final Payload:', JSON.stringify(finalPayload, null, 2));
      const response = await api.post('/api/content', finalPayload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (err) {
      console.error('Upload thunk error:', err);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
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
  reducers: {
    updateUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    resetUpload: (state) => {
      state.uploadProgress = 0;
      state.isUploading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isUploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.isUploading = false;
        state.uploadProgress = 100;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
      });
  },
});

export const { updateUploadProgress, resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
