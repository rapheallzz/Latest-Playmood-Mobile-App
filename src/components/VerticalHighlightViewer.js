import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Image } from 'react-native';
import { useEventListener } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';
import { FontAwesome } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

const HighlightPlayer = ({ highlight, isActive }) => {
  const player = useVideoPlayer(highlight.content.video, (player) => {
    if (isActive) {
      player.play();
    }
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  useEventListener(player, 'timeUpdate', ({ currentTime }) => {
    const startTime = highlight.content.shortPreview?.start || 0;
    const endTime = highlight.content.shortPreview?.end;

    if (endTime && currentTime >= endTime) {
      player.seek(startTime);
    }
  });

  return <VideoView player={player} style={styles.video} />;
};

const VerticalHighlightViewer = ({ highlights, startIndex, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentSectionOpen, setCommentSectionOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleCommentIconClick = () => {
    setCommentSectionOpen(!isCommentSectionOpen);
  };

  return (
    <Modal visible={true} transparent={false} animationType="slide">
      <Swiper
        loop={false}
        showsPagination={false}
        index={startIndex}
        horizontal={false}
        onIndexChanged={setActiveIndex}
      >
        {highlights.map((highlight, index) => (
          <View key={highlight._id} style={styles.slide}>
            <HighlightPlayer highlight={highlight} isActive={index === activeIndex} />
            <Pressable style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="times" size={24} color="white" />
            </Pressable>
            <View style={styles.overlay}>
              <View style={styles.bottomInfo}>
                <View style={styles.creatorInfo}>
                  <Image source={{ uri: highlight.creator.profileImage }} style={styles.avatar} />
                  <Text style={styles.creatorName}>@{highlight.creator.name}</Text>
                </View>
                <Text style={styles.title}>{highlight.content.title}</Text>
              </View>
              <View style={styles.actions}>
                <Pressable style={styles.actionButton} onPress={handleLikeClick}>
                  <FontAwesome name="heart" size={24} color={isLiked ? 'red' : 'white'} />
                  <Text style={styles.actionText}>{highlight.content.likesCount || 0}</Text>
                </Pressable>
                <Pressable style={styles.actionButton} onPress={handleCommentIconClick}>
                  <FontAwesome name="comment" size={24} color="white" />
                  <Text style={styles.actionText}>{highlight.content.commentsCount || 0}</Text>
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <FontAwesome name="paper-plane" size={24} color="white" />
                  <Text style={styles.actionText}>Share</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </Swiper>
    </Modal>
  );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      },
      video: {
        width: '100%',
        height: '100%',
      },
      closeButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 1,
      },
      overlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      bottomInfo: {
        flex: 1,
        justifyContent: 'flex-end',
      },
      creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      creatorName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      title: {
        color: 'white',
        fontSize: 14,
      },
      actions: {
        justifyContent: 'space-around',
        alignItems: 'center',
      },
      actionButton: {
        alignItems: 'center',
        marginBottom: 20,
      },
      actionText: {
        color: 'white',
        marginTop: 5,
      },
});

export default VerticalHighlightViewer;
