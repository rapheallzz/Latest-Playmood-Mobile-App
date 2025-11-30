import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useFeeds from '../features/useFeeds';

const FeedSection = ({ user, creatorId, onPostClick }) => {
  const { feeds, isLoadingFeeds, error } = useFeeds(user, creatorId);

  if (isLoadingFeeds) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!feeds || feeds.length === 0) {
    return <Text style={styles.noPostsMessage}>No feed posts yet.</Text>;
  }

  return (
    <FlatList
      data={feeds}
      keyExtractor={(item) => item._id}
      numColumns={3}
      renderItem={({ item, index }) => (
        <Pressable style={styles.feedItem} onPress={() => onPostClick(item, index)}>
          <Image source={{ uri: item.media[0].url }} style={styles.feedImage} />
          <View style={styles.overlay}>
            <View style={styles.iconContainer}>
              <FontAwesome name="heart" size={16} color="white" />
              <Text style={styles.iconText}>{item.likes.length}</Text>
            </View>
            <View style={styles.iconContainer}>
              <FontAwesome name="comment" size={16} color="white" />
              <Text style={styles.iconText}>{item.comments.length}</Text>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noPostsMessage: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    feedItem: {
        flex: 1,
        aspectRatio: 1,
        margin: 1,
        position: 'relative',
    },
    feedImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        color: 'white',
        marginLeft: 5,
    },
});

export default FeedSection;
