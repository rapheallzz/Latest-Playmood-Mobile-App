import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, Pressable, Alert } from 'react-native';
import MobileHeader from '../components/MobileHeader';
import LikeSlider from '../components/LikeSlider';
import FavoriteSlider from '../components/FavoriteSlider';
import WatchlistSlider from '../components/WatchlistSlider';
import FriendSlider from '../components/FriendSlider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThumbsUp, faHeart, faUser, faList, faStar, faEye } from '@fortawesome/free-solid-svg-icons';
import tw from 'tailwind-react-native-classnames'; 
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { clearContentCache } from '../features/contentSlice';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const [sliderType, setSliderType] = useState('likes');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigation.navigate('Home');
      console.log('logout success');
    });
  };

  const handleManageCookies = async () => {
    try {
      await AsyncStorage.removeItem('user');
      Alert.alert('Success', 'Cookies have been cleared.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cookies.');
    }
  };

  const handleRemoveCache = () => {
    dispatch(clearContentCache());
    Alert.alert('Success', 'Cache has been cleared.');
  };

  const renderSlider = () => {
    switch (sliderType) {
      case 'likes':
        return <LikeSlider />;
      case 'favorites':
        return <FavoriteSlider />;
      case 'watchlist':
        return <WatchlistSlider />;
      default:
        return <LikeSlider />;
    }
  };

  return (
    <View style={tw`flex-1 bg-black`}>
      <MobileHeader />
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.content}>
        <View style={styles.profileContainer}>
          <Image source={require('../../assets/images/10.png')} style={styles.profileImage} />
          <Text style={styles.userName}>{user ? user.name : 'Guest'}</Text>
          <Text style={styles.changeAccount}>Edit Profile</Text>
          <Pressable style={styles.logOut} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>

        <View style={styles.adminButtons}>
          <Pressable style={styles.adminButton} onPress={() => navigation.navigate('AdminPage')}>
            <Text style={styles.buttonText}>Admin Page</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => navigation.navigate('ApplyAsCreator')}>
            <Text style={styles.buttonText}>Apply as a Creator</Text>
          </Pressable>
          <Pressable style={styles.adminButton} onPress={() => navigation.navigate('PostVideoForReview')}>
            <Text style={styles.buttonText}>Post a Video for Review</Text>
          </Pressable>
        </View>

        <View>
          <View style={styles.dashButton}>
            <Pressable style={styles.subButton} onPress={() => setSliderType('likes')}>
              <FontAwesomeIcon icon={faHeart} style={styles.icon} />
              <Text style={styles.buttonText}>Likes</Text>
            </Pressable>
            <Pressable style={styles.subButton} onPress={() => setSliderType('favorites')}>
              <FontAwesomeIcon icon={faStar} style={styles.icon} />
              <Text style={styles.buttonText}>Favorites</Text>
            </Pressable>
            <Pressable style={styles.subButton}>
              <FontAwesomeIcon icon={faUser} style={styles.icon} />
              <Text style={styles.buttonText}>For You</Text>
            </Pressable>
            <Pressable style={styles.subButton} onPress={() => setSliderType('watchlist')}>
              <FontAwesomeIcon icon={faEye} style={styles.icon} />
              <Text style={styles.buttonText}>Watchlist</Text>
            </Pressable>
          </View>

          <View style={styles.dashSlider}>
            {renderSlider()}
          </View>
        </View>

        <View>
          <View style={styles.dashButton}>
            <Pressable onPress={() => navigation.navigate('Donation')}>
              <Text style={styles.slideText}>Donation | </Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Subscription')}>
              <Text style={styles.slideText}>Subscription | </Text>
            </Pressable>
            <Text style={styles.slideText}>Friends</Text>
          </View>
          <FriendSlider />
        </View>

        <View style={styles.boxHolder}>
          <Pressable style={styles.boxText} onPress={() => navigation.navigate('Activities')}>
            <Text style={styles.slideText}>Activities</Text>
          </Pressable>
          <Pressable style={styles.boxText} onPress={handleManageCookies}>
            <Text style={styles.slideText}>Manage Cookies</Text>
          </Pressable>
          <Pressable style={styles.boxText} onPress={handleRemoveCache}>
            <Text style={styles.slideText}>Remove Cache</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
  },
  content: {
    flex: 1,
    marginLeft: 20,
    backgroundColor: 'black',
  },
  icon: {
    color: 'white',
    width: 5,
    height: 2,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
  },
  changeAccount: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
  },
  logOut: {
    marginVertical: 10,
    width: 70,
    height: 30,
    backgroundColor: '#541011',
    borderRadius: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 35,
  },
  subButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#541011',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
  },
  dashSlider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'evenly',
    alignItems: 'center',
    paddingLeft: 30,
    marginTop: 30,
  },
  slideText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  },
  boxHolder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30,
  },
  boxText: {
    flex: 1,
    alignItems: 'center',
    height: 70,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'white',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  adminButtons: {
    marginTop: 20,
    alignItems: 'center',
  },
  adminButton: {
    width: 200,
    height: 40,
    backgroundColor: '#541011',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

