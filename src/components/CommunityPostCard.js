import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons';

const CommunityPostCard = ({ post, user, onLike, onCommentSubmit }) => {
    const [comment, setComment] = React.useState('');
    const isLiked = post.likes.includes(user?._id);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image source={{ uri: post.user.profileImage }} style={styles.profileImage} />
                <View>
                    <Text style={styles.userName}>{post.user.name}</Text>
                    <Text style={styles.timestamp}>{new Date(post.timestamp).toLocaleDateString()}</Text>
                </View>
            </View>
            <Text style={styles.content}>{post.content}</Text>
            <View style={styles.actions}>
                <Pressable onPress={() => onLike(post._id, isLiked)} style={styles.actionButton}>
                    <FontAwesomeIcon icon={faHeart} style={[styles.icon, isLiked ? styles.liked : {}]} />
                    <Text style={styles.actionText}>{post.likes.length}</Text>
                </Pressable>
                <View style={styles.actionButton}>
                    <FontAwesomeIcon icon={faComment} style={styles.icon} />
                    <Text style={styles.actionText}>{post.comments.length}</Text>
                </View>
            </View>
            <View style={styles.commentsSection}>
                {post.comments.map((c) => (
                    <View key={c._id} style={styles.comment}>
                        <Text style={styles.commentText}>{c.content}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.commentForm}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={comment}
                    onChangeText={setComment}
                />
                <Pressable onPress={() => { onCommentSubmit(post._id, comment); setComment(''); }} style={styles.commentButton}>
                    <Text style={styles.commentButtonText}>Post</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        color: 'white',
        fontWeight: 'bold',
    },
    timestamp: {
        color: 'gray',
        fontSize: 12,
    },
    content: {
        color: 'white',
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    icon: {
        color: 'white',
    },
    liked: {
        color: 'red',
    },
    actionText: {
        color: 'white',
        marginLeft: 5,
    },
    commentsSection: {
        marginTop: 10,
    },
    comment: {
        marginBottom: 5,
    },
    commentText: {
        color: 'white',
    },
    commentForm: {
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
    commentButton: {
        marginLeft: 10,
        backgroundColor: '#541011',
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    commentButtonText: {
        color: 'white',
    },
});

export default CommunityPostCard;
