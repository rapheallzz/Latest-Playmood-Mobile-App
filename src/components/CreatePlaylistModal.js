import React from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Pressable, Switch } from 'react-native';

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  newPlaylist,
  setNewPlaylist,
  handleCreatePlaylist,
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
          <Text style={styles.modalTitle}>Create Playlist</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={newPlaylist.name}
            onChangeText={(text) => setNewPlaylist({ ...newPlaylist, name: text })}
            placeholder="Playlist Name"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={newPlaylist.description}
            onChangeText={(text) => setNewPlaylist({ ...newPlaylist, description: text })}
            placeholder="Playlist Description"
            placeholderTextColor="#888"
            multiline
          />

          <View style={styles.visibilityRow}>
            <Text style={styles.label}>Public</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={newPlaylist.visibility === 'public' ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                const newVisibility = newPlaylist.visibility === 'public' ? 'private' : 'public';
                setNewPlaylist({ ...newPlaylist, visibility: newVisibility });
              }}
              value={newPlaylist.visibility === 'public'}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSave]}
              onPress={handleCreatePlaylist}
              disabled={!newPlaylist.name.trim()}
            >
              <Text style={styles.buttonText}>Create</Text>
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
  visibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonSave: {
    backgroundColor: '#541011',
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
