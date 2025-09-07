import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const UserHeader = ({
  profileImage,
  creatorName,
  onEditChannel,
  onUploadVideo,
  onCreatePlaylist,
  onPostCommunity,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <Text style={styles.creatorName}>{creatorName}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onEditChannel}>
          <Text style={styles.buttonText}>Edit Channel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onUploadVideo}>
          <Text style={styles.buttonText}>Upload Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCreatePlaylist}>
          <Text style={styles.buttonText}>Create Playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPostCommunity}>
          <Text style={styles.buttonText}>Community Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  creatorName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default UserHeader;
