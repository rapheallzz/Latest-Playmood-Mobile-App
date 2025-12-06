import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useNavigation } from '@react-navigation/native';
import MobileHeader from '../components/MobileHeader';
import { uploadFile } from '../features/uploadSlice';

const VideoPlayer = ({ videoAsset }) => {
  const player = useVideoPlayer(videoAsset.uri, (player) => {
    player.play();
  });

  return <VideoView style={styles.video} player={player} allowsFullscreen nativeControls />;
};

export default function UploadScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const { isUploading, error } = useSelector((state) => state.upload);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [credit, setCredit] = useState('');
  const [category, setCategory] = useState('Fashion Show');
  const [files, setFiles] = useState([]);
  const [videoAsset, setVideoAsset] = useState(null);
  const [previewStart, setPreviewStart] = useState('0');
  const [previewEnd, setPreviewEnd] = useState('10');

  useEffect(() => {
    if (error) {
      // Log the full error for debugging
      console.error('Upload Error:', error);

      // Determine the message to show to the user
      let displayMessage = 'Failed to upload video. Please try again.'; // Default message
      if (typeof error === 'string') {
        displayMessage = error;
      } else if (typeof error === 'object' && error !== null) {
        // Look for a 'message' or 'error' property in the object
        displayMessage = error.message || error.error || JSON.stringify(error);
      }

      Alert.alert('Upload Failed', displayMessage);
    }
  }, [error]);

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
      if (video) {
        setVideoAsset(video);
        setPreviewEnd(String(Math.min(10, (video.duration || 10000) / 1000)));
      } else {
        setVideoAsset(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !description.trim()) {
        Alert.alert('Error', 'Title and description are required.');
        return;
    }
    if (!files || files.length === 0) {
        Alert.alert('Error', 'Please select at least one file to upload.');
        return;
    }

    if (!loggedInUser || !loggedInUser.token) {
        Alert.alert('Error', 'You must be logged in to upload a video.');
        return;
    }

    const videoFile = files.find(asset => asset.type === 'video');
    const thumbnailFile = files.find(asset => asset.type === 'image');

    if (!videoFile) {
      Alert.alert('Error', 'Please select a video file to upload.');
      return;
    }

    const videoMetadata = { title, description, credit, category };

    dispatch(uploadFile({ videoFile, thumbnailFile, videoMetadata, previewStart, previewEnd }))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Video uploaded successfully! It will be reviewed by our team.');
        navigation.goBack();
      })
      .catch(() => {
        // Error is handled by the useEffect hook
      });
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
