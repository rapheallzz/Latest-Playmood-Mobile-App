import React from 'react';
import { Modal, View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';

export default function AddVideoToPlaylistModal({
  isOpen,
  onClose,
  videos,
  onAddVideo,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add Video to Playlist</Text>

          <FlatList
            data={videos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.videoItem}>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Pressable
                  style={styles.addButton}
                  onPress={() => onAddVideo(item._id)}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>
            )}
          />

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
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
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: '100%',
  },
  thumbnail: {
    width: 80,
    height: 45,
    borderRadius: 5,
  },
  videoTitle: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#541011',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
