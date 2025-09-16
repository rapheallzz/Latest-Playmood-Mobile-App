import React from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Pressable } from 'react-native';

export default function EditPostModal({
  isOpen,
  onClose,
  post,
  setPost,
  onSave,
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
          <Text style={styles.modalTitle}>Edit Post</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            value={post.content}
            onChangeText={(text) => setPost({ ...post, content: text })}
            placeholder="Post Content"
            placeholderTextColor="#888"
            multiline
          />

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSave]}
              onPress={onSave}
              disabled={!post.content.trim()}
            >
              <Text style={styles.buttonText}>Save</Text>
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
  input: {
    width: '100%',
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
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
