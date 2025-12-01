import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentComments, commentOnContent } from '../features/contentSlice';
import { FontAwesome } from '@expo/vector-icons';

const CommentSection = ({ contentId, isVisible, onClose }) => {
  const dispatch = useDispatch();
  const { comments, isLoading } = useSelector((state) => state.content);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isVisible) {
      dispatch(fetchContentComments(contentId));
    }
  }, [dispatch, contentId, isVisible]);

  const handlePostComment = () => {
    if (newComment.trim()) {
      dispatch(commentOnContent({ contentId, comment: newComment }));
      setNewComment('');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentAuthor}>{item.author.name}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color="black" />
          </Pressable>
          <Text style={styles.title}>Comments</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={<Text>No comments yet.</Text>}
            />
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <Pressable style={styles.postButton} onPress={handlePostComment}>
              <Text style={styles.postButtonText}>Post</Text>
            </Pressable>
          </View>
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
    height: '60%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  commentContainer: {
    marginBottom: 15,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  postButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  postButtonText: {
    color: 'white',
  },
});

export default CommentSection;
