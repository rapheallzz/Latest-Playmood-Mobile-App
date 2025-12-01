import React, { useState } from 'react';
import { View, Text, Modal, TextInput, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postContentComment } from '../features/contentSlice';
import profile from '../../assets/icon-profile.png';

const CommentSection = ({ isVisible, onClose, contentId }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.content.comments[contentId] || []);
  const { isLoading, isError, message } = useSelector((state) => state.content);
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (newComment.trim()) {
      dispatch(postContentComment({ contentId, comment: newComment }));
      setNewComment('');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image source={profile} style={styles.profileIcon} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.user?.name}</Text>
          <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<Text style={styles.noCommentsText}>No comments yet.</Text>}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <Pressable style={styles.postButton} onPress={handlePostComment} disabled={isLoading}>
              <Text style={styles.postButtonText}>Post</Text>
            </Pressable>
          </View>
          {isError && <Text style={styles.errorText}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentUser: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: 'gray',
    fontSize: 12,
  },
  commentText: {
    marginTop: 5,
  },
  noCommentsText: {
    textAlign: 'center',
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  postButton: {
    marginLeft: 10,
    backgroundColor: '#541011',
    padding: 10,
    borderRadius: 5,
  },
  postButtonText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CommentSection;
