import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContentSection = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Uploads':
        return <Text>Here are your video uploads.</Text>;
      case 'Playlists':
        return <Text>Here are your playlists.</Text>;
      case 'Community':
        return <Text>Here is your community feed.</Text>;
      case 'About':
        return <Text>Here is your about section.</Text>;
      default:
        return <Text>Welcome to your dashboard!</Text>;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default ContentSection;
