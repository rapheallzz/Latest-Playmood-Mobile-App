import React, { useState, useMemo } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { VideoView, useVideoPlayer } from 'expo-video';

const VideoPlayer = ({ video }) => {
  const player = useVideoPlayer(video.uri, (player) => {
    player.play();
  });

  return <VideoView style={styles.videoPlayer} player={player} allowsFullscreen nativeControls />;
};

const CreateHighlightModal = ({ isOpen, onClose, onCreate, availableVideos }) => {
  const [contentId, setContentId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedVideo = useMemo(() => {
    return availableVideos.find((video) => video._id === contentId);
  }, [contentId, availableVideos]);

  const handleSubmit = async () => {
    if (!contentId || startTime === '' || endTime === '' || !title) {
      setError('All fields are required.');
      return;
    }
    if (parseFloat(startTime) >= parseFloat(endTime)) {
      setError('Start time must be less than end time.');
      return;
    }
    setError('');
    setIsLoading(true);

    const result = await onCreate({
      contentId,
      startTime: parseFloat(startTime),
      endTime: parseFloat(endTime),
      title,
    });

    setIsLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to create highlight.');
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>Create Highlight</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.label}>Select Video</Text>
            <Picker
              selectedValue={contentId}
              onValueChange={(itemValue) => setContentId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Choose a video" value="" />
              {availableVideos.map((video) => (
                <Picker.Item key={video._id} label={video.title} value={video._id} />
              ))}
            </Picker>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            {selectedVideo && (
              <VideoPlayer video={{ uri: selectedVideo.video }} />
            )}

            <View style={styles.timeContainer}>
              <View style={styles.timeInput}>
                <Text style={styles.label}>Start Time (s)</Text>
                <TextInput
                  style={styles.input}
                  value={startTime}
                  onChangeText={setStartTime}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.label}>End Time (s)</Text>
                <TextInput
                  style={styles.input}
                  value={endTime}
                  onChangeText={setEndTime}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Creating...' : 'Create'}</Text>
              </Pressable>
            </View>
          </ScrollView>
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
      label: {
        color: 'white',
        fontSize: 16,
        marginBottom: 8,
      },
      input: {
        backgroundColor: '#333',
        color: 'white',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
      },
      picker: {
        backgroundColor: '#333',
        color: 'white',
        marginBottom: 15,
      },
      videoPlayer: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 15,
      },
      timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
      },
      timeInput: {
        flex: 1,
      },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
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
      errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
      },
});

export default CreateHighlightModal;
