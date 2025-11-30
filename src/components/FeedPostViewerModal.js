import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Image, ScrollView, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { useSelector } from 'react-redux';
import contentService from '../features/contentService';

const FeedPostViewerModal = ({ post, onClose, onNext, onPrev }) => {
  const { user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleLikeToggle = async () => {
    if (!user) return;
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    try {
      if (newIsLiked) {
        await contentService.likeFeedPost({ feedId: post._id, token: user.token });
      } else {
        await contentService.unlikeFeedPost({ feedId: post._id, token: user.token });
      }
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
    }
  };

  const submitComment = async () => {
    if (newComment.trim() === '' || !user) {
      return;
    }
    try {
      const updatedPost = await contentService.commentOnFeedPost({
        feedId: post._id,
        comment: newComment,
        token: user.token,
      });
      setComments(updatedPost.comments || []);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (!post || !post.media || post.media.length === 0) return null;

  return (
    <Modal visible={true} transparent={false} animationType="slide">
        <View style={styles.modalContainer}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="times" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.prevButton} onPress={onPrev}>
            <FontAwesome name="chevron-left" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.nextButton} onPress={onNext}>
            <FontAwesome name="chevron-right" size={24} color="white" />
        </Pressable>
        <Swiper loop={false} showsPagination={true}>
          {post.media.map((mediaItem, index) => (
            <Image key={index} source={{ uri: mediaItem.url }} style={styles.media} resizeMode="contain" />
          ))}
        </Swiper>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Image source={{ uri: post.user?.profileImage }} style={styles.avatar} />
            <Text style={styles.creatorName}>{post.user?.name}</Text>
          </View>
          <Text style={styles.caption}>{post.caption}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.actionButton} onPress={handleLikeToggle}>
              <FontAwesome name="heart" size={24} color={isLiked ? 'red' : 'white'} />
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => setIsCommentsOpen(!isCommentsOpen)}>
              <FontAwesome name="comment" size={24} color="white" />
            </Pressable>
            <Pressable style={styles.actionButton}>
                <FontAwesome name="paper-plane" size={24} color="white" />
            </Pressable>
          </View>
          <Text style={styles.likesCount}>{likesCount} likes</Text>
          {isCommentsOpen && (
            <ScrollView style={styles.commentsSection}>
              {comments.map((comment) => (
                <View key={comment._id} style={styles.comment}>
                  <Text style={styles.commentUser}>{comment.user.name}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor="#888"
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <Pressable style={styles.sendButton} onPress={submitComment}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
      },
      closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
      },
      prevButton: {
        position: 'absolute',
        top: '50%',
        left: 20,
        zIndex: 1,
      },
      nextButton: {
        position: 'absolute',
        top: '50%',
        right: 20,
        zIndex: 1,
      },
      media: {
        flex: 1,
      },
      contentContainer: {
        padding: 20,
      },
      header: {
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
      caption: {
        color: 'white',
        fontSize: 14,
        marginBottom: 10,
      },
      actions: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      actionButton: {
        marginRight: 20,
      },
      likesCount: {
        color: 'white',
        fontWeight: 'bold',
      },
      commentsSection: {
        marginTop: 10,
        maxHeight: 150,
      },
      comment: {
        marginBottom: 5,
      },
      commentUser: {
        color: 'white',
        fontWeight: 'bold',
      },
      commentText: {
        color: 'white',
      },
      commentInputContainer: {
        flexDirection: 'row',
        marginTop: 10,
      },
      commentInput: {
        flex: 1,
        backgroundColor: '#333',
        color: 'white',
        borderRadius: 5,
        padding: 10,
      },
      sendButton: {
        backgroundColor: '#541011',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        justifyContent: 'center',
      },
      sendButtonText: {
        color: 'white',
      },
});

export default FeedPostViewerModal;
