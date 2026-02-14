import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThumbsUp, faStar, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { likeContent, unlikeContent, addToWatchlist } from '../features/contentSlice';
import BrandedAlert from './BrandedAlert';

const ContentCard = ({ item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.auth);
  const { likes } = useSelector((state) => state.content);

  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'success' });

  const isLiked = likes.some(like => like.contentId === item._id);

  const handlePress = () => {
    // Navigate to the VideoScreen and pass the content ID, title, etc.
    navigation.navigate('VideoScreen', {
      _id: item._id,  // Content ID
      title: item.title,
      credits: item.credit,
      desc: item.description,
      movie: item.video,
    });
  };

  const handleLike = () => {
    if (!userToken) {
      setAlertConfig({
        visible: true,
        title: 'Authentication Required',
        message: 'Please log in to like content.',
        type: 'error'
      });
      return;
    }

    if (isLiked) {
      dispatch(unlikeContent(item._id));
    } else {
      dispatch(likeContent(item._id));
    }
  };

  const handleWatchlist = () => {
    if (!userToken) {
      setAlertConfig({
        visible: true,
        title: 'Authentication Required',
        message: 'Please log in to add content to your watchlist.',
        type: 'error'
      });
      return;
    }

    dispatch(addToWatchlist(item._id))
      .unwrap()
      .then(() => {
        setAlertConfig({
          visible: true,
          title: 'Added to Watchlist',
          message: `${item.title} has been added to your watchlist.`,
          type: 'success'
        });
      })
      .catch((error) => {
        setAlertConfig({
          visible: true,
          title: 'Error',
          message: typeof error === 'string' ? error : (error.message || 'Failed to add to watchlist.'),
          type: 'error'
        });
      });
  };

  return (
    <>
      <BrandedAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />
      <Pressable onPress={handlePress} style={styles.card}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.title}>{item.title}</Text>
        {/* Like and favorite buttons remain the same */}
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={handleLike}>
            <FontAwesomeIcon icon={faHeart} style={[styles.icon, isLiked && styles.likedIcon]} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleWatchlist}>
            <FontAwesomeIcon icon={faStar} style={styles.icon} />
          </Pressable>
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  thumbnail: {
    width: 120,
    height: 180,
  },
  title: {
    width: 100,
    color: 'white',
    fontSize: 10,
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  actionButton: {
    marginHorizontal: 10,
  },
  icon: {
    color: 'white',
    fontSize: 20,
  },
  likedIcon: {
    color: 'red',
  },
});

export default ContentCard;
