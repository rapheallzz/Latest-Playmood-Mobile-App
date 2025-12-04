import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import MobileHeader from '../components/MobileHeader';

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
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoAsset, setVideoAsset] = useState(null);
  const [previewStart, setPreviewStart] = useState('0');
  const [previewEnd, setPreviewEnd] = useState('10');
  const [isUploading, setIsUploading] = useState(false);

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
      const video = selectedAssets.find(asset => asset.type === 'video');
      const thumbnail = selectedAssets.find(asset => asset.type === 'image');

      if (video) {
        setVideoFile(video);
        setVideoAsset(video); // for preview
        setPreviewEnd(String(Math.min(10, (video.duration || 10000) / 1000)));
      } else {
        setVideoFile(null);
        setVideoAsset(null);
      }

      if (thumbnail) {
        setThumbnailFile(thumbnail);
      } else {
        setThumbnailFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !description.trim()) {
        Alert.alert('Error', 'Title and description are required.');
        return;
    }
    if (!videoFile) {
        Alert.alert('Error', 'Please select a video file to upload.');
        return;
    }

    if (!loggedInUser || !loggedInUser.token) {
        Alert.alert('Error', 'You must be logged in to upload a video.');
        return;
    }

    setIsUploading(true);

    const uploadToCloudinary = async (file, fileType) => {
        try {
            const signatureResponse = await axios.post(
                'https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/content/signature',
                { type: fileType === 'video' ? 'videos' : 'images' },
                { headers: { Authorization: `Bearer ${loggedInUser.token}` } }
            );

            const { signature, timestamp, api_key, cloud_name } = signatureResponse.data;
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/${fileType === 'video' ? 'video' : 'image'}/upload`;

            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', {
                uri: file.uri,
                name: file.fileName || `upload.${file.uri.split('.').pop()}`,
                type: `${file.type}/${file.uri.split('.').pop()}`,
            });
            cloudinaryFormData.append('api_key', api_key);
            cloudinaryFormData.append('timestamp', timestamp);
            cloudinaryFormData.append('signature', signature);

            const cloudinaryResponse = await axios.post(cloudinaryUrl, cloudinaryFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return {
                public_id: cloudinaryResponse.data.public_id,
                url: cloudinaryResponse.data.secure_url,
            };
        } catch (error) {
            console.error(`Error uploading ${fileType} to Cloudinary:`, error.response?.data || error.message);
            Alert.alert('Upload Error', `Failed to upload ${fileType}.`);
            return null;
        }
    };

    try {
      const videoData = await uploadToCloudinary(videoFile, 'video');
      if (!videoData) {
        setIsUploading(false);
        return;
      }

      let thumbnailData = null;
      if (thumbnailFile) {
        thumbnailData = await uploadToCloudinary(thumbnailFile, 'image');
        if (!thumbnailData) {
          setIsUploading(false);
          return;
        }
      }

      const finalPayload = {
        title,
        description,
        credit,
        category,
        userId: loggedInUser._id,
        previewStart: parseFloat(previewStart),
        previewEnd: parseFloat(previewEnd),
        languageCode: 'en-US',
        video: videoData,
        ...(thumbnailData && { thumbnail: thumbnailData }),
      };

      await axios.post(
        'https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/content',
        finalPayload,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Success', 'Video uploaded successfully! It will be reviewed by our team.');
      navigation.goBack();

    } catch (err) {
        const errorMessage = err.response?.data?.error || 'An unexpected error occurred during the final step of the upload.';
        console.error('Error during final content submission:', errorMessage);
        Alert.alert('Submission Error', errorMessage);
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
              <Text style={styles.buttonText}>Select Video & Thumbnail</Text>
            </Pressable>
            {videoFile && <Text style={styles.fileInfo}>Video selected: {videoFile.fileName}</Text>}
            {thumbnailFile && <Text style={styles.fileInfo}>Thumbnail selected: {thumbnailFile.fileName}</Text>}

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
});
