import React, { useState, useRef } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

export default function UploadVideoModal({ isOpen, onClose, handleUpload }) {
  const videoRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [credit, setCredit] = useState('');
  const [category, setCategory] = useState('Fashion Show');
  const [files, setFiles] = useState([]);
  const [videoAsset, setVideoAsset] = useState(null);
  const [previewStart, setPreviewStart] = useState('0');
  const [previewEnd, setPreviewEnd] = useState('10');

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
        // Set preview end to 10s or video duration, whichever is smaller
        setPreviewEnd(String(Math.min(10, video.duration / 1000)));
      } else {
        setVideoAsset(null);
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.modalTitle}>Upload Video</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Video Title" placeholderTextColor="#888" />

            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Video Description" placeholderTextColor="#888" multiline />

            <Text style={styles.label}>Production Credits</Text>
            <TextInput style={styles.input} value={credit} onChangeText={setCredit} placeholder="Credits" placeholderTextColor="#888" />

            <Text style={styles.label}>Category</Text>
            {/* A picker would be better here, but using TextInput for simplicity for now */}
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Category" placeholderTextColor="#888" />

            <Text style={styles.label}>Video and Thumbnail</Text>
            <Pressable style={styles.button} onPress={handleFilePick}>
              <Text style={styles.buttonText}>Select Files</Text>
            </Pressable>
            {files.length > 0 && <Text style={styles.fileInfo}>{files.length} file(s) selected</Text>}

            {videoAsset && (
              <View style={styles.videoContainer}>
                <Video
                  ref={videoRef}
                  style={styles.video}
                  source={{ uri: videoAsset.uri }}
                  useNativeControls
                  resizeMode="contain"
                />
                <Text style={styles.label}>Preview (10-15 seconds)</Text>
                <View style={styles.previewControls}>
                    <TextInput style={styles.previewInput} value={previewStart} onChangeText={setPreviewStart} keyboardType="numeric" placeholder="Start"/>
                    <TextInput style={styles.previewInput} value={previewEnd} onChangeText={setPreviewEnd} keyboardType="numeric" placeholder="End"/>
                </View>
              </View>
            )}

          </ScrollView>

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonSave]} onPress={() => handleUpload({ title, description, credit, category, assets: files, previewStart, previewEnd })}>
              <Text style={styles.buttonText}>Upload</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        margin: 20,
        width: '90%',
        height: '90%',
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 20,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        backgroundColor: '#555',
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonSave: {
        backgroundColor: '#541011',
        flex: 1,
        marginHorizontal: 5,
    },
    buttonClose: {
        backgroundColor: '#555',
        flex: 1,
        marginHorizontal: 5,
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
