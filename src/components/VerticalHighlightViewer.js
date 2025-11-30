import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

const { height: screenHeight } = Dimensions.get('window');

const VerticalHighlightViewer = ({ highlights, startIndex, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentSectionOpen, setCommentSectionOpen] = useState(false);
  const videoRefs = useRef([]);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleCommentIconClick = () => {
    setCommentSectionOpen(!isCommentSectionOpen);
  };

  const handlePlaybackStatusUpdate = (status, highlight) => {
    if (status.isLoaded) {
      const startTime = highlight.content.shortPreview?.start * 1000 || 0;
      const endTime = highlight.content.shortPreview?.end * 1000 || status.durationMillis;
      if (status.positionMillis >= endTime) {
        videoRefs.current[highlight.index]?.replayAsync({ positionMillis: startTime });
      }
    }
  };

  return (
    <Modal visible={true} transparent={false} animationType="slide">
      <Swiper
        loop={false}
        showsPagination={false}
        index={startIndex}
        horizontal={false}
      >
        {highlights.map((highlight, index) => (
          <View key={highlight._id} style={styles.slide}>
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              source={{ uri: highlight.content.video }}
              style={styles.video}
              shouldPlay
              onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status, { ...highlight, index })}
            />
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
      },
      video: {
        ...StyleSheet.absoluteFillObject,
      },
      closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
      },
      overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      bottomInfo: {
        flex: 1,
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
