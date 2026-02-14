import { createUploadTask, FileSystemUploadType } from 'expo-file-system/legacy';

const uploadToR2 = async (fileUri, uploadUrl, contentType, onProgress) => {
  const uploadTask = createUploadTask(
    uploadUrl,
    fileUri,
    {
      httpMethod: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      uploadType: FileSystemUploadType.BINARY_CONTENT,
    },
    (progress) => {
      if (onProgress) {
        const percent = Math.round(
          (progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100
        );
        onProgress(percent);
      }
    }
  );

  try {
    const result = await uploadTask.uploadAsync();
    if (result.status >= 200 && result.status < 300) {
      return result.body;
    } else {
      throw new Error(`Upload failed with status ${result.status}: ${result.body}`);
    }
  } catch (error) {
    console.error('R2 Upload Error:', error);
    throw error;
  }
};

const uploadService = {
  uploadToR2,
};

export default uploadService;
