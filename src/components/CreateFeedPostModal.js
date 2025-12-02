import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CreateFeedPostModal = ({ isOpen, onClose, onCreateFeedPost }) => {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true,
    });

    if (!result.canceled && result.assets) {
      setMedia(result.assets);
    }
  };

  const handleSubmit = async () => {
    if (!caption || media.length === 0) {
      Alert.alert('Error', 'Please provide a caption and at least one image.');
      return;
    }

    setIsUploading(true);
    await onCreateFeedPost(caption, media);
    setIsUploading(false);
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Feed Post</Text>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor="#888"
            value={caption}
            onChangeText={setCaption}
            multiline
          />
          <Pressable style={styles.mediaButton} onPress={handleFileChange}>
            <Text style={styles.buttonText}>Select Media</Text>
          </Pressable>
          <View style={styles.buttonsContainer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isUploading}>
              <Text style={styles.buttonText}>{isUploading ? 'Posting...' : 'Post'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: '90%',
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        padding: 20,
      },
      modalTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
      },
      input: {
        backgroundColor: '#333',
        color: 'white',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        minHeight: 100,
        textAlignVertical: 'top',
      },
      mediaButton: {
        backgroundColor: '#541011',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
      },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      cancelButton: {
        backgroundColor: '#555',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginRight: 10,
      },
      submitButton: {
        backgroundColor: '#541011',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
      },
});

export default CreateFeedPostModal;
