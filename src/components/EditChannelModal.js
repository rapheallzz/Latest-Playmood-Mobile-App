import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditChannelModal({
  isOpen,
  onClose,
  creatorName,
  setCreatorName,
  about,
  setAbout,
  instagram,
  setInstagram,
  tiktok,
  setTiktok,
  linkedin,
  setLinkedin,
  twitter,
  setTwitter,
  bannerImage,
  setBannerImageFile,
  handleUpdateChannelInfo,
}) {
  const handlePickBanner = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setBannerImageFile(result.assets[0]);
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
            <Text style={styles.modalTitle}>Edit Channel</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={creatorName}
              onChangeText={setCreatorName}
              placeholder="Your channel name"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>About</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={about}
              onChangeText={setAbout}
              placeholder="Tell viewers about your channel"
              placeholderTextColor="#888"
              multiline
            />

            <Text style={styles.label}>Instagram URL</Text>
            <TextInput style={styles.input} value={instagram} onChangeText={setInstagram} placeholderTextColor="#888" />

            <Text style={styles.label}>TikTok URL</Text>
            <TextInput style={styles.input} value={tiktok} onChangeText={setTiktok} placeholderTextColor="#888" />

            <Text style={styles.label}>LinkedIn URL</Text>
            <TextInput style={styles.input} value={linkedin} onChangeText={setLinkedin} placeholderTextColor="#888" />

            <Text style={styles.label}>Twitter URL</Text>
            <TextInput style={styles.input} value={twitter} onChangeText={setTwitter} placeholderTextColor="#888" />

            <Text style={styles.label}>Banner Image</Text>
            {bannerImage && <Image source={{ uri: bannerImage }} style={styles.bannerPreview} />}
            <Pressable style={styles.button} onPress={handlePickBanner}>
                <Text style={styles.buttonText}>Change Banner</Text>
            </Pressable>

          </ScrollView>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonSave]}
              onPress={handleUpdateChannelInfo}
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
    height: '80%',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  bannerPreview: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#333',
  },
});
