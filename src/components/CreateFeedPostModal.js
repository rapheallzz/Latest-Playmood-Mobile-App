import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, TextInput, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BrandedAlert from './BrandedAlert';

const CreateFeedPostModal = ({ isOpen, onClose, onCreateFeedPost }) => {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'success', onConfirm: () => {} });

  const resetStateAndClose = () => {
    setCaption('');
    setMedia([]);
    onClose();
  };

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setMedia(result.assets);
    }
  };

  const handleSubmit = async () => {
    if (!caption || media.length === 0) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please provide a caption and at least one image.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
      return;
    }

    setIsUploading(true);
    try {
      await onCreateFeedPost(caption, media);
      setIsUploading(false);
      setAlertConfig({
        visible: true,
        title: 'Success!',
        message: 'Your post has been successfully published.',
        type: 'success',
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          resetStateAndClose();
        }
      });
    } catch (error) {
      setIsUploading(false);
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: error.message || 'Failed to create feed post.',
        type: 'error',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={resetStateAndClose}>
      <BrandedAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
      />
      <Pressable style={styles.modalContainer} onPress={resetStateAndClose}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
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

          {media.length > 0 && (
            <ScrollView horizontal style={styles.mediaPreviewContainer}>
              {media.map((item, index) => (
                <Image key={index} source={{ uri: item.uri }} style={styles.previewImage} />
              ))}
            </ScrollView>
          )}

          <View style={styles.buttonsContainer}>
            <Pressable style={styles.cancelButton} onPress={resetStateAndClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isUploading}>
              <Text style={styles.buttonText}>{isUploading ? 'Posting...' : 'Post'}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
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
      mediaPreviewContainer: {
        marginBottom: 15,
      },
      previewImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginRight: 10,
      },
});

export default CreateFeedPostModal;
