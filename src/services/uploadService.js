import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { CLOUDINARY_CLOUD_NAME } from '../apiConfig';

const uploadToCloudinary = async (file, signatureData, resourceType, onProgress) => {
  const cloudName = CLOUDINARY_CLOUD_NAME;
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const chunkSize = 20 * 1024 * 1024; // 20MB

  const asset = {
    uri: file.uri,
    name: file.fileName,
    type: file.mimeType,
  };

  // For images or small videos, upload in a single request
  if (resourceType === 'image' || file.fileSize < chunkSize) {
    const formData = new FormData();
    formData.append('file', asset);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('api_key', signatureData.api_key);

    const response = await axios.post(uploadUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total
          ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
          : 0;
        onProgress(progress);
      },
    });
    return response.data;
  }

  // For large videos, use chunked uploading
  const uniqueUploadId = `uqid-${Date.now()}`;
  let start = 0;
  let finalResponse;
  const fileSize = file.fileSize

  while (start < fileSize) {
    const end = Math.min(start + chunkSize, fileSize);
    const chunkBase64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
      position: start,
      length: end - start,
    });

    const tempFileUri = `${FileSystem.cacheDirectory}chunk-${start}`;
    await FileSystem.writeAsStringAsync(tempFileUri, chunkBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const formData = new FormData();
    formData.append('file', {
      uri: tempFileUri,
      name: asset.name,
      type: asset.type,
    });
    formData.append('api_key', signatureData.api_key);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('signature', signatureData.signature);

    try {
      const response = await axios.post(
        uploadUrl,
        formData,
        {
          headers: {
            'X-Unique-Upload-Id': uniqueUploadId,
            'Content-Range': `bytes ${start}-${end - 1}/${fileSize}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const chunkLoaded = progressEvent.loaded;
            const totalLoaded = start + chunkLoaded;
            const progress = Math.round((totalLoaded / fileSize) * 100);
            onProgress(progress);
          },
        }
      );
      finalResponse = response.data;
    } finally {
      await FileSystem.deleteAsync(tempFileUri, { idempotent: true });
    }

    start = end;
  }

  return finalResponse;
};

const uploadService = {
  uploadToCloudinary,
};

export default uploadService;
