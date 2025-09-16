import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, FlatList, Linking } from 'react-native';
import ContentCard from '../components/ContentCard';
import CommunityPostCard from '../components/CommunityPostCard';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton } from 'react-share';
import EditChannelModal from '../components/EditChannelModal';
import CommunityPostModal from '../components/CommunityPostModal';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import contentService from '../features/contentService';
import AddVideoToPlaylistModal from '../components/AddVideoToPlaylistModal';
import EditPostModal from '../components/EditPostModal';

export default function CreatorChannel() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { user: loggedInUser } = useSelector((state) => state.auth);
    
    const { creator } = route.params || {};
    const creatorId = creator?._id;

    const isOwner = loggedInUser?._id === creatorId;
    
    const [subscribed, setSubscribed] = useState(false);
    const [spank, setSpank] = useState(false);
    const [creatorData, setCreatorData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState({});
    const [activeTab, setActiveTab] = useState('VIDEOS');

    // State for Edit Channel Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [instagram, setInstagram] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [twitter, setTwitter] = useState('');

    // State for Community Post Modal
    const [showCommunityModal, setShowCommunityModal] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');

    // State for Edit Post Modal
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    // State for Playlist Modal
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '', visibility: 'public' });

    // State for Edit Playlist Modal
    const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState(null);

    // State for Add Video to Playlist Modal
    const [showAddVideoModal, setShowAddVideoModal] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    // State for Banner Image
    const [bannerImageFile, setBannerImageFile] = useState(null);


    const fetchPlaylists = async () => {
        if (!creatorId) {
            setError('Creator ID is missing.');
            Alert.alert('Error', 'Creator ID is missing.');
            return;
        }

        setIsLoadingPlaylists(true);
        setError('');
        try {
            const response = await axios.get(
                `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/playlists/user/${creatorId}/public`
            );
            setPlaylists(response.data.playlists || []);
        } catch (err) {
            console.error('Error fetching playlists:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to load playlists.');
            Alert.alert('Error', 'Failed to load playlists.');
            setPlaylists([]);
        } finally {
            setIsLoadingPlaylists(false);
        }
    };

    const fetchCommunityPosts = async () => {
        if (!creatorId) {
            setError('Creator ID is missing.');
            Alert.alert('Error', 'Creator ID is missing.');
            return;
        }

        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData) {
            Alert.alert('Error', 'Please log in to view community posts.');
            return;
        }

        setIsLoadingPosts(true);
        setError('');
        try {
            const token = userData.token;
            const response = await axios.get(
                `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/community/${creatorId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setCommunityPosts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching community posts:', err.response?.data || err.message);
            if (
              err.response?.status === 404 ||
              err.response?.data?.message?.toLowerCase().includes('no community posts')
            ) {
              setCommunityPosts([]);
            } else {
              setError(
                err.response?.data?.message || 'Failed to load community posts due to a server error.'
              );
              Alert.alert('Error', 'Failed to load community posts due to a server error.');
              setCommunityPosts([]);
            }
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const handleUpdateChannelInfo = async () => {
        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData || !userData.token) {
            Alert.alert('Error', 'You must be logged in to update your channel.');
            return;
        }

        const token = userData.token;
        let response;

        try {
            if (bannerImageFile) {
                // If there's a new banner, use FormData
                const formData = new FormData();
                formData.append('name', name);
                formData.append('about', about);
                // Socials might need to be stringified if the backend expects it with FormData
                formData.append('socials', JSON.stringify({ instagram, tiktok, linkedin, twitter }));

                const uriParts = bannerImageFile.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                formData.append('bannerImage', {
                    uri: bannerImageFile.uri,
                    name: bannerImageFile.fileName || `banner.${fileType}`,
                    type: `${bannerImageFile.type}/${fileType}`,
                });

                response = await axios.put(
                    `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/channel/${creatorId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                        transformRequest: (data, headers) => {
                            return formData; // Axios workaround
                        },
                    }
                );
            } else {
                // If no new banner, send as JSON
                const payload = {
                    name,
                    about,
                    socials: { instagram, tiktok, linkedin, twitter },
                };
                response = await axios.put(
                    `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/channel/${creatorId}`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }

            // Update state with the response data
            setCreatorData(response.data.channel);
            setBannerImageFile(null); // Reset the file state
            setShowEditModal(false);
            Alert.alert('Success', 'Channel information updated successfully!');

        } catch (err) {
            console.error('Error updating channel info:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to update channel information.');
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) {
            Alert.alert('Error', 'Post content cannot be empty.');
            return;
        }

        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData || !userData.token) {
            Alert.alert('Error', 'You must be logged in to post.');
            return;
        }

        try {
            const token = userData.token;
            const response = await axios.post(
                `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/community/create`,
                { content: newPostContent },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Add the new post to the start of the list
            setCommunityPosts(prev => [response.data, ...prev]);
            setNewPostContent('');
            setShowCommunityModal(false);
            Alert.alert('Success', 'Community post created successfully!');

        } catch (err) {
            console.error('Error creating community post:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to create community post.');
        }
    };

    const handleOpenEditPostModal = (post) => {
        setEditingPost(post);
        setShowEditPostModal(true);
    };

    const handleUpdatePost = async () => {
        if (!editingPost) return;

        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData || !userData.token) {
            Alert.alert('Error', 'You must be logged in to update a post.');
            return;
        }

        try {
            const token = userData.token;
            const updatedPost = await contentService.updateCommunityPost(
                editingPost._id,
                editingPost.content,
                token
            );
            setCommunityPosts(communityPosts.map(p => p._id === editingPost._id ? updatedPost : p));
            setShowEditPostModal(false);
            setEditingPost(null);
            Alert.alert('Success', 'Post updated successfully!');
        } catch (err) {
            console.error('Error updating post:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to update post.');
        }
    };

    const handleDeletePost = async (postId) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const userString = await AsyncStorage.getItem('user');
                        const userData = userString ? JSON.parse(userString) : null;
                        if (!userData || !userData.token) {
                            Alert.alert('Error', 'You must be logged in to delete a post.');
                            return;
                        }

                        try {
                            const token = userData.token;
                            await contentService.deleteCommunityPost(postId, token);
                            setCommunityPosts(communityPosts.filter(p => p._id !== postId));
                            Alert.alert('Success', 'Post deleted successfully!');
                        } catch (err) {
                            console.error('Error deleting post:', err.response?.data || err.message);
                            Alert.alert('Error', 'Failed to delete post.');
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteComment = async (postId, commentId) => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const userString = await AsyncStorage.getItem('user');
                        const userData = userString ? JSON.parse(userString) : null;
                        if (!userData || !userData.token) {
                            Alert.alert('Error', 'You must be logged in to delete a comment.');
                            return;
                        }

                        try {
                            const token = userData.token;
                            await contentService.deleteCommunityComment(postId, commentId, token);
                            setCommunityPosts(communityPosts.map(post => {
                                if (post._id === postId) {
                                    return {
                                        ...post,
                                        comments: post.comments.filter(c => c._id !== commentId),
                                    };
                                }
                                return post;
                            }));
                            Alert.alert('Success', 'Comment deleted successfully!');
                        } catch (err) {
                            console.error('Error deleting comment:', err.response?.data || err.message);
                            Alert.alert('Error', 'Failed to delete comment.');
                        }
                    },
                },
            ]
        );
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylist.name.trim()) {
            Alert.alert('Error', 'Playlist name cannot be empty.');
            return;
        }

        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData || !userData.token) {
            Alert.alert('Error', 'You must be logged in to create a playlist.');
            return;
        }

        try {
            const token = userData.token;
            const response = await axios.post(
                `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/playlists`,
                { ...newPlaylist, videos: [] }, // Send videos as empty array
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setPlaylists(prev => [response.data.playlist, ...prev]);
            setNewPlaylist({ name: '', description: '', visibility: 'public' });
            setShowPlaylistModal(false);
            Alert.alert('Success', 'Playlist created successfully!');

        } catch (err) {
            console.error('Error creating playlist:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to create playlist.');
        }
    };

    const handleOpenEditPlaylistModal = (playlist) => {
        setEditingPlaylist(playlist);
        setShowEditPlaylistModal(true);
    };

    const handleUpdatePlaylist = async () => {
        if (!editingPlaylist) return;

        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData || !userData.token) {
            Alert.alert('Error', 'You must be logged in to update a playlist.');
            return;
        }

        try {
            const token = userData.token;
            const response = await contentService.updatePlaylist(
                editingPlaylist._id,
                { name: editingPlaylist.name, description: editingPlaylist.description },
                token
            );
            setPlaylists(playlists.map(p => p._id === editingPlaylist._id ? response.playlist : p));
            setShowEditPlaylistModal(false);
            setEditingPlaylist(null);
            Alert.alert('Success', 'Playlist updated successfully!');
        } catch (err) {
            console.error('Error updating playlist:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to update playlist.');
        }
    };

    const handleDeletePlaylist = async (playlistId) => {
        Alert.alert(
            'Delete Playlist',
            'Are you sure you want to delete this playlist?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const userString = await AsyncStorage.getItem('user');
                        const userData = userString ? JSON.parse(userString) : null;
                        if (!userData || !userData.token) {
                            Alert.alert('Error', 'You must be logged in to delete a playlist.');
                            return;
                        }

                        try {
                            const token = userData.token;
                            await contentService.deletePlaylist(playlistId, token);
                            setPlaylists(playlists.filter(p => p._id !== playlistId));
                            Alert.alert('Success', 'Playlist deleted successfully!');
                        } catch (err) {
                            console.error('Error deleting playlist:', err.response?.data || err.message);
                            Alert.alert('Error', 'Failed to delete playlist.');
                        }
                    },
                },
            ]
        );
    };

    const handleOpenAddVideoModal = (playlist) => {
        setSelectedPlaylist(playlist);
        setShowAddVideoModal(true);
    };

    const handleAddVideoToPlaylist = async (contentId) => {
        if (!selectedPlaylist) return;

        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData || !userData.token) {
            Alert.alert('Error', 'You must be logged in to add a video to a playlist.');
            return;
        }

        try {
            const token = userData.token;
            const response = await contentService.addVideoToPlaylist(selectedPlaylist._id, contentId, token);
            setPlaylists(playlists.map(p => p._id === selectedPlaylist._id ? response.playlist : p));
            setShowAddVideoModal(false);
            Alert.alert('Success', 'Video added to playlist successfully!');
        } catch (err) {
            console.error('Error adding video to playlist:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to add video to playlist.');
        }
    };

    const handleOpenEditModal = () => {
        setName(creatorData?.name || '');
        setAbout(creatorData?.about || '');
        // Assuming social links are nested as they are in the web app
        setInstagram(creatorData?.socials?.instagram || creatorData?.instagram || '');
        setTiktok(creatorData?.socials?.tiktok || creatorData?.tiktok || '');
        setLinkedin(creatorData?.socials?.linkedin || creatorData?.linkedin || '');
        setTwitter(creatorData?.socials?.twitter || creatorData?.twitter || '');
        setShowEditModal(true);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === 'PLAYLISTS' && playlists.length === 0) {
            fetchPlaylists();
        }
        if (tab === 'COMMUNITY' && communityPosts.length === 0) {
            fetchCommunityPosts();
        }
        if (tab === 'ABOUT') {
            // No data fetching needed for about tab
        }
    };

    const handleLike = async (postId, isLiked) => {
        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData) {
            Alert.alert('Error', 'Please log in to like posts.');
            return;
        }
        try {
            const token = userData.token;
            const endpoint = isLiked
                ? `/api/community/${postId}/unlike`
                : `/api/community/${postId}/like`;
            await axios.put(
                `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com${endpoint}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCommunityPosts((prev) =>
                prev.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: isLiked
                                ? post.likes.filter((id) => id !== userData._id)
                                : [...post.likes, userData._id],
                        }
                        : post
                )
            );
        } catch (err) {
            console.error('Error liking/unliking post:', err);
            Alert.alert('Error', 'Failed to update like status.');
        }
    };

    const handleCommentSubmit = async (postId, comment) => {
        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData) {
            Alert.alert('Error', 'Please log in to comment.');
            return;
        }
        if (!comment.trim()) {
            Alert.alert('Error', 'Comment cannot be empty.');
            return;
        }
        try {
            const token = userData.token;
            const response = await axios.post(
                `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/community/${postId}/comment`,
                { content: comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCommunityPosts((prev) =>
                prev.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: [
                                ...post.comments,
                                {
                                    _id: response.data.commentId || Date.now(),
                                    user: userData,
                                    content: comment,
                                    timestamp: new Date().toISOString(),
                                },
                            ],
                        }
                        : post
                )
            );
        } catch (err) {
            console.error('Error adding comment:', err);
            Alert.alert('Error', 'Failed to add comment.');
        }
    };

    const renderHeader = () => (
        <>
            <View style={styles.bannerContainer}>
                <Image source={{ uri: creatorData?.bannerImage }} style={styles.bannerImage} />
                <View style={styles.shareIcons}>
                    <Pressable><FontAwesome name="facebook" size={24} color="white" /></Pressable>
                    <Pressable><FontAwesome name="twitter" size={24} color="white" /></Pressable>
                    <Pressable><FontAwesome name="whatsapp" size={24} color="white" /></Pressable>
                    <Pressable><FontAwesome name="instagram" size={24} color="white" /></Pressable>
                    <Pressable><FontAwesome name="linkedin" size={24} color="white" /></Pressable>
                </View>
            </View>

            <View style={styles.profileContainer}>
                <Image source={{ uri: creatorData?.profileImage }} style={styles.profileImage} />
                <View>
                    <Text style={styles.creatorName}>{creatorData?.name}</Text>
                    <Text style={styles.subscriberCount}>{creatorData?.subscribers} subscribers</Text>
                </View>
                {!isOwner && (
                    <>
                        <Pressable style={styles.subscribeButton} onPress={handleSubscribeClick}>
                            <Text style={styles.subscribeText}>{subscribed ? 'Unsubscribe' : 'Subscribe'}</Text>
                        </Pressable>
                        <FontAwesome name="bell" size={24} color="white" />
                    </>
                )}
            </View>

            {isOwner && (
                <View style={styles.creatorActions}>
                    <Pressable style={styles.actionButton} onPress={() => setShowPlaylistModal(true)}>
                        <Text style={styles.actionButtonText}>New Playlist</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={() => setShowCommunityModal(true)}>
                        <Text style={styles.actionButtonText}>New Post</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={() => navigation.navigate('PostVideoForReview')}>
                        <Text style={styles.actionButtonText}>Upload Video</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton} onPress={handleOpenEditModal}>
                        <Text style={styles.actionButtonText}>Edit Channel</Text>
                    </Pressable>
                </View>
            )}

            <View style={styles.navLinks}>
                <Pressable onPress={() => handleTabClick('VIDEOS')}><Text style={styles.navLink}>VIDEOS</Text></Pressable>
                <Pressable onPress={() => handleTabClick('PLAYLISTS')}><Text style={styles.navLink}>PLAYLIST</Text></Pressable>
                <Pressable onPress={() => handleTabClick('COMMUNITY')}><Text style={styles.navLink}>COMMUNITY</Text></Pressable>
                <Pressable onPress={() => handleTabClick('ABOUT')}><Text style={styles.navLink}>ABOUT</Text></Pressable>
            </View>
        </>
    );

    const renderContent = () => {
        const header = renderHeader();

        switch (activeTab) {
            case 'VIDEOS':
                return (
                    <ScrollView>
                        {header}
                        <View style={styles.contentSection}>
                            <Text style={styles.contentTitle}>Videos</Text>
                            <FlatList
                                data={videos}
                                renderItem={({ item }) => <ContentCard item={item} />}
                                keyExtractor={(item) => item._id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </ScrollView>
                );
            case 'PLAYLISTS':
                if (isLoadingPlaylists) {
                    return <View><ActivityIndicator size="large" color="#fff" /></View>;
                }
                return (
                    <FlatList
                        ListHeaderComponent={header}
                        data={playlists}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item: playlist }) => (
                            <View style={styles.contentSection}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.contentTitle}>{playlist.name}</Text>
                                    {isOwner && (
                                        <View style={{ flexDirection: 'row' }}>
                                            <Pressable onPress={() => handleOpenAddVideoModal(playlist)} style={{ marginRight: 10 }}><FontAwesome name="plus" size={20} color="white" /></Pressable>
                                            <Pressable onPress={() => handleOpenEditPlaylistModal(playlist)} style={{ marginRight: 10 }}><FontAwesome name="edit" size={20} color="white" /></Pressable>
                                            <Pressable onPress={() => handleDeletePlaylist(playlist._id)}><FontAwesome name="trash" size={20} color="white" /></Pressable>
                                        </View>
                                    )}
                                </View>
                                {playlist.videos.length > 0 ? (
                                    <FlatList
                                        data={playlist.videos}
                                        renderItem={({ item }) => <ContentCard item={item} />}
                                        keyExtractor={(item) => item._id.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    />
                                ) : (
                                    <Text style={styles.errorText}>This playlist has no videos.</Text>
                                )}
                            </View>
                        )}
                    />
                );
            case 'COMMUNITY':
                if (isLoadingPosts) {
                    return <View><ActivityIndicator size="large" color="#fff" /></View>;
                }
                return (
                    <FlatList
                        ListHeaderComponent={header}
                        data={communityPosts}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.contentSection}>
                                <CommunityPostCard
                                    post={item}
                                    user={loggedInUser}
                                    onLike={handleLike}
                                    onCommentSubmit={handleCommentSubmit}
                                    onDeletePost={handleDeletePost}
                                    onEditPost={handleOpenEditPostModal}
                                    onDeleteComment={handleDeleteComment}
                                />
                            </View>
                        )}
                    />
                );
            case 'ABOUT':
                return (
                    <ScrollView>
                        {header}
                        <View style={styles.contentSection}>
                            <Text style={styles.contentTitle}>About</Text>
                            <Text style={styles.aboutText}>{creatorData?.about}</Text>
                            <Text style={styles.contentTitle}>Connect</Text>
                            <View style={styles.socialIcons}>
                                {creatorData?.twitter && (<Pressable onPress={() => Linking.openURL(creatorData.twitter)}><FontAwesome name="twitter" size={24} color="white" /></Pressable>)}
                                {creatorData?.instagram && (<Pressable onPress={() => Linking.openURL(creatorData.instagram)}><FontAwesome name="instagram" size={24} color="white" /></Pressable>)}
                                {creatorData?.linkedin && (<Pressable onPress={() => Linking.openURL(creatorData.linkedin)}><FontAwesome name="linkedin" size={24} color="white" /></Pressable>)}
                                {creatorData?.tiktok && (<Pressable onPress={() => Linking.openURL(creatorData.tiktok)}><FontAwesome name="tiktok" size={24} color="white" /></Pressable>)}
                            </View>
                        </View>
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    const handleSubscribeClick = async () => {
        const userString = await AsyncStorage.getItem('user');
        const userData = userString ? JSON.parse(userString) : null;
        if (!userData) {
          Alert.alert('Error', 'Please log in to subscribe.');
          return;
        }

        setSpank(true);
        setTimeout(() => {
          setSpank(false);
        }, 1000);

        try {
          const token = userData.token;
          if (!token) {
            Alert.alert('Error', 'Authentication token missing.');
            return;
          }
          if (subscribed) {
            await axios.put(
              `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/subscribe`,
              { creatorId: creatorId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setSubscribed(false);
            setCreatorData((prev) => ({
              ...prev,
              subscribers: prev.subscribers > 0 ? prev.subscribers - 1 : 0,
            }));
          } else {
            await axios.post(
              `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/subscribe`,
              { creatorId: creatorId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setSubscribed(true);
            setCreatorData((prev) => ({
              ...prev,
              subscribers: prev.subscribers + 1,
            }));
          }
        } catch (err) {
          console.error('Subscription error:', err.response?.data || err.message);
          Alert.alert(
            'Error',
            err.response?.data?.message ||
              (subscribed ? 'Failed to unsubscribe.' : 'Failed to subscribe.')
          );
        }
    };
  
    useEffect(() => {
        const fetchCreatorData = async () => {
          if (!creatorId) {
            setError('Creator ID is missing.');
            Alert.alert('Error', 'Creator ID is missing.');
            setIsLoading(false);
            return;
          }

          setIsLoading(true);
          setError('');
          try {
            const userString = await AsyncStorage.getItem('user');
            const userData = userString ? JSON.parse(userString) : null;
            const token = userData?.token;

            const channelResponse = await axios.get(
              `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/channel/${creatorId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setCreatorData(channelResponse.data);
            setVideos(channelResponse.data.content || []);

            if (userData && token) {
              const subscriptionResponse = await axios.get(
                `https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/subscribe/subscribers`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const isSubscribed = subscriptionResponse.data.some(
                (sub) => sub.creatorId === creatorId
              );
              setSubscribed(isSubscribed);
            }
          } catch (error) {
            console.error('Error fetching creator data:', error);
            setError('Failed to load creator data.');
            Alert.alert('Error', 'Failed to load creator data.');
          } finally {
            setIsLoading(false);
          }
        };

        fetchCreatorData();
    }, [creatorId, loggedInUser]);
  
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!creatorId) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No creator data available.</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        {renderContent()}

        {isOwner && (
        <EditChannelModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          creatorName={name}
          setCreatorName={setName}
          about={about}
          setAbout={setAbout}
          instagram={instagram}
          setInstagram={setInstagram}
          tiktok={tiktok}
          setTiktok={setTiktok}
          linkedin={linkedin}
          setLinkedin={setLinkedin}
          twitter={twitter}
          setTwitter={setTwitter}
          bannerImage={bannerImageFile?.uri || creatorData?.bannerImage}
          setBannerImageFile={setBannerImageFile}
          handleUpdateChannelInfo={handleUpdateChannelInfo}
        />
      )}

      {isOwner && (
        <CommunityPostModal
          isOpen={showCommunityModal}
          onClose={() => setShowCommunityModal(false)}
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
          handleCreatePost={handleCreatePost}
        />
      )}

      {isOwner && (
        <CreatePlaylistModal
          isOpen={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          newPlaylist={newPlaylist}
          setNewPlaylist={setNewPlaylist}
          handleCreatePlaylist={handleCreatePlaylist}
        />
      )}

      {isOwner && editingPlaylist && (
        <CreatePlaylistModal
          isOpen={showEditPlaylistModal}
          onClose={() => setShowEditPlaylistModal(false)}
          newPlaylist={editingPlaylist}
          setNewPlaylist={setEditingPlaylist}
          handleCreatePlaylist={handleUpdatePlaylist}
          isEditing
        />
      )}

      {isOwner && (
        <AddVideoToPlaylistModal
          isOpen={showAddVideoModal}
          onClose={() => setShowAddVideoModal(false)}
          videos={videos}
          onAddVideo={handleAddVideoToPlaylist}
        />
      )}

      {isOwner && editingPost && (
        <EditPostModal
            isOpen={showEditPostModal}
            onClose={() => setShowEditPostModal(false)}
            post={editingPost}
            setPost={setEditingPost}
            onSave={handleUpdatePost}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: '#541011',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
  },
  creatorActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  shareIcons: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 150,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  creatorName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subscriberCount: {
    color: 'white',
    fontSize: 11,
  },
  subscribeButton: {
    backgroundColor: '#541011',
    padding: 10,
    borderRadius: 5,
  },
  subscribeText: {
    color: '#f3f3f3',
    fontSize: 12,
  },
  navLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  navLink: {
    color: 'white',
    fontSize: 14,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  contentTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contentCard: {
    width: 150,
    marginBottom: 20,
  },
  contentThumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  aboutText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
  },
});
