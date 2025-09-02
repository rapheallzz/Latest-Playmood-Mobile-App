import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends } from '../features/contentSlice';
import FriendCard from './FriendCard';

const { width: screenWidth } = Dimensions.get('window');

const FriendSlider = () => {
  const dispatch = useDispatch();
  const { friends, isLoading, isError, message } = useSelector(state => state.content);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchFriends(user._id));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <View style={styles.sliderContainer}>
      {isError ? (
        <Text style={styles.message}>Error: {message}</Text>
      ) : (
        <Carousel
          data={friends}
          renderItem={({ item, index }) => (
            <FriendCard friend={item} />
          )}
          width={screenWidth}
          height={120}
          loop={true}
          autoPlay={true}
          autoPlayInterval={3000}
          style={styles.carousel}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 120,
  },
  carousel: {
    paddingLeft: 15,
  },
  message: {
    color: 'white',
    fontSize: 20,
    marginLeft: 40,
    marginTop: 12,
    marginBottom: 15,
  },
});

export default FriendSlider;
