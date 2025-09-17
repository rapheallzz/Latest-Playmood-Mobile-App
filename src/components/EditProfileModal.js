import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileModal({
  isOpen,
  onClose,
  userName,
  setUserName,
  email,
  setEmail,
  profileImage,
  setProfileImageFile,
  handleUpdateProfile,
}) {
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImageFile(result.assets[0]);
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
          <ScrollView style={{width: '100%'}}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Your name"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Your email"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Profile Image</Text>
            {profileImage && <Image source={{ uri: profileImage }} style={styles.profilePreview} />}
            <Pressable style={styles.button} onPress={handlePickImage}>
                <Text style={styles.buttonText}>Change Profile Image</Text>
            </Pressable>

          </ScrollView>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonSave]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Close</Text>
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
    height: 'auto',
    maxHeight: '80%',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#541011',
    marginBottom: 10,
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
  profilePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: '#333',
  },
});
