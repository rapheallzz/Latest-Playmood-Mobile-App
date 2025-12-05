import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import MobileHeader from '../components/MobileHeader';
import contentService from '../features/contentService';
import { CLOUDINARY_CLOUD_NAME } from '../apiConfig';

const VideoPlayer = ({ videoAsset }) => {
  const player = useVideoPlayer(videoAsset.uri, (player) => {
    player.play();
  });

  return <VideoView style={styles.video} player={player} allowsFullscreen nativeControls />;
};

export default function UploadScreen() {
  const navigation = useNavigation();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [credit, setCredit] = useState('');
  const [category, setCategory] = useState('Fashion Show');
  const [files, setFiles] = useState([]);
  const [videoAsset, setVideoAsset] = useState(null);
  const [thumbnailAsset, setThumbnailAsset] = useState(null);
  const [previewStart, setPreviewStart] = useState('0');
  const [previewEnd, setPreviewEnd] = useState('10');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFilePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAssets = result.assets || [];
      setFiles(selectedAssets);
      const video = selectedAssets.find(asset => asset.type === 'video');
      const thumbnail = selectedAssets.find(asset => asset.type === 'image');
      if (video) {
        setVideoAsset(video);
        setPreviewEnd(String(Math.min(10, (video.duration || 10000) / 1000)));
      } else {
        setVideoAsset(null);
      }
      if (thumbnail) {
        setThumbnailAsset(thumbnail);
      } else {
        setThumbnailAsset(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Title and description are required.');
      return;
    }
    if (!videoAsset) {
      Alert.alert('Error', 'Please select a video to upload.');
      return;
    }

    if (!loggedInUser || !loggedInUser.token) {
      Alert.alert('Error', 'You must be logged in to upload a video.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get signatures for video and thumbnail
      const token = loggedInUser.token;
      const videoSignatureResponse = await contentService.getSignature('videos', token);
      let thumbnailSignatureResponse;
      if (thumbnailAsset) {
        thumbnailSignatureResponse = await contentService.getSignature('images', token);
      }

      // Upload video to Cloudinary
      const videoUploadData = new FormData();
      const videoUriParts = videoAsset.uri.split('.');
      const videoFileType = videoUriParts[videoUriParts.length - 1];
      videoUploadData.append('file', {
        uri: videoAsset.uri,
        name: videoAsset.fileName || `upload.${videoFileType}`,
        type: `${videoAsset.type}/${videoFileType}`,
      });
      videoUploadData.append('api_key', videoSignatureResponse.api_key);
      videoUploadData.append('timestamp', videoSignatureResponse.timestamp);
      videoUploadData.append('signature', videoSignatureResponse.signature);
      videoUploadData.append('folder', videoSignatureResponse.folder);

      const videoCloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        videoUploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Upload thumbnail to Cloudinary
      let thumbnailCloudinaryResponse;
      if (thumbnailAsset && thumbnailSignatureResponse) {
        const thumbnailUploadData = new FormData();
        const thumbnailUriParts = thumbnailAsset.uri.split('.');
        const thumbnailFileType = thumbnailUriParts[thumbnailUriParts.length - 1];
        thumbnailUploadData.append('file', {
          uri: thumbnailAsset.uri,
          name: thumbnailAsset.fileName || `upload.${thumbnailFileType}`,
          type: `${thumbnailAsset.type}/${thumbnailFileType}`,
        });
        thumbnailUploadData.append('api_key', thumbnailSignatureResponse.api_key);
        thumbnailUploadData.append('timestamp', thumbnailSignatureResponse.timestamp);
        thumbnailUploadData.append('signature', thumbnailSignatureResponse.signature);
        thumbnailUploadData.append('folder', thumbnailSignatureResponse.folder);

        thumbnailCloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          thumbnailUploadData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      // Send data to your server
      const serverPayload = {
        title,
        description,
        credit,
        category,
        userId: loggedInUser._id,
        previewStart,
        previewEnd,
        languageCode: 'en-US',
        video: videoCloudinaryResponse,
        thumbnail: thumbnailCloudinaryResponse,
      };

      const token = loggedInUser.token;
      await axios.post(
        `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/content`,
        serverPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Success', 'Video uploaded successfully! It will be reviewed by our team.');
      navigation.goBack();

    } catch (err) {
      console.error('Error uploading video:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to upload video.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
        <MobileHeader />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Upload Video</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Video Title" placeholderTextColor="#888" />

            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Video Description" placeholderTextColor="#888" multiline />

            <Text style={styles.label}>Production Credits</Text>
            <TextInput style={styles.input} value={credit} onChangeText={setCredit} placeholder="Credits" placeholderTextColor="#888" />

            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Category" placeholderTextColor="#888" />

            <Text style={styles.label}>Video and Thumbnail</Text>
            <Pressable style={styles.button} onPress={handleFilePick}>
              <Text style={styles.buttonText}>Select Files</Text>
            </Pressable>
            {files.length > 0 && <Text style={styles.fileInfo}>{files.length} file(s) selected</Text>}

            {videoAsset && (
              <View style={styles.videoContainer}>
                <VideoPlayer videoAsset={videoAsset} />
                <Text style={styles.label}>Preview (10-15 seconds)</Text>
                <View style={styles.previewControls}>
                    <TextInput style={styles.previewInput} value={previewStart} onChangeText={setPreviewStart} keyboardType="numeric" placeholder="Start"/>
                    <TextInput style={styles.previewInput} value={previewEnd} onChangeText={setPreviewEnd} keyboardType="numeric" placeholder="End"/>
                </View>
              </View>
            )}

            {isUploading && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Uploading: {uploadProgress}%</Text>
              </View>
            )}

            {isUploading && (
              <View style={styles.progressContainer}>
                <ActivityIndicator size="large" color="#541011" />
                <Text style={styles.progressText}>Uploading: {uploadProgress}%</Text>
              </View>
            )}

            <Pressable style={[styles.button, styles.uploadButton]} onPress={handleUpload} disabled={isUploading}>
              {isUploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Upload</Text>}
            </Pressable>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    scrollView: {
        width: '100%',
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    label: {
        fontSize: 16,
        color: 'white',
        marginBottom: 5,
        alignSelf: 'flex-start',
        width: '100%'
    },
    input: {
        width: '100%',
        backgroundColor: '#333',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    fileInfo: {
        color: 'white',
        marginVertical: 10,
    },
    button: {
        borderRadius: 5,
        padding: 12,
        elevation: 2,
        backgroundColor: '#555',
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    uploadButton: {
        backgroundColor: '#541011',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    videoContainer: {
        width: '100%',
        marginTop: 20,
    },
    video: {
        width: '100%',
        height: 200,
        backgroundColor: 'black',
    },
    previewControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    previewInput: {
        flex: 1,
        backgroundColor: '#333',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        textAlign: 'center',
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    progressText: {
        color: 'white',
        fontSize: 16,
    },
});
