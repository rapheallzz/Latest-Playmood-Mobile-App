import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import UserHeader from '../components/creator/UserHeader';
import Navigation from '../components/creator/Navigation';
import ContentSection from '../components/creator/ContentSection';

const CreatorDashboardScreen = () => {
  const [activeTab, setActiveTab] = useState('Uploads');

  // Placeholder data and functions
  const profileImage = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'; // Placeholder image
  const creatorName = 'John Doe';

  const handleEditChannel = () => Alert.alert('Placeholder', 'Edit Channel button pressed');
  const handleUploadVideo = () => Alert.alert('Placeholder', 'Upload Video button pressed');
  const handleCreatePlaylist = () => Alert.alert('Placeholder', 'Create Playlist button pressed');
  const handlePostCommunity = () => Alert.alert('Placeholder', 'Community Post button pressed');

  return (
    <View style={styles.container}>
      <UserHeader
        profileImage={profileImage}
        creatorName={creatorName}
        onEditChannel={handleEditChannel}
        onUploadVideo={handleUploadVideo}
        onCreatePlaylist={handleCreatePlaylist}
        onPostCommunity={handlePostCommunity}
      />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContentSection activeTab={activeTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default CreatorDashboardScreen;
