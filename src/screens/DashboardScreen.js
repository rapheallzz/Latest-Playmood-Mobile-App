import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, Pressable, Alert, Linking } from 'react-native';
import MobileHeader from '../components/MobileHeader';
import LikeSlider from '../components/LikeSlider';
import ForYouSlider from '../components/ForYouSlider';
import FriendSlider from '../components/FriendSlider';
import FavoriteSlider from '../components/FavoriteSlider';
import WatchlistSlider from '../components/WatchlistSlider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThumbsUp, faHeart, faUser, faList, faStar, faEye, faHistory, faCookieBite, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import tw from 'tailwind-react-native-classnames'; 
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../features/authSlice';
import { useNavigation } from '@react-navigation/native';
import EditProfileModal from '../components/EditProfileModal';
import axios from 'axios';

export default function Dashboard() {
  const [sliderType, setSliderType] = useState('likes');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  const [profileImageFile, setProfileImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfileImage(user.profileImage);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
      console.log('logout success');
    });
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to update your profile.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (profileImageFile) {
      const uriParts = profileImageFile.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('profileImage', {
        uri: profileImageFile.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await axios.put(`https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/users/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      dispatch(setUser({ ...user, ...response.data }));
      setIsModalOpen(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const renderSlider = () => {
    switch (sliderType) {
      case 'likes':
        return <LikeSlider />;
      case 'favorites':
        return <FavoriteSlider />;
      case 'watchlist':
        return <WatchlistSlider />;
      case 'forYou':
        return <ForYouSlider />;
      // case 'friends':
      //   return <FriendSlider />;
      default:
        return <LikeSlider />;
    }
  };

  return (
    <View style={tw`flex-1 bg-black`}>
      <MobileHeader />
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.content}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <Text style={styles.userName}>{name}</Text>
          <Pressable style={styles.editProfileButton} onPress={() => setIsModalOpen(true)}>
            <Text style={styles.changeAccount}>Edit Profile</Text>
            <Image source={require('../../assets/edit.png')} style={{width: 15, height: 15, tintColor: 'white', marginLeft: 5}} />
          </Pressable>
          <Pressable style={styles.logOut} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>

        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userName={name}
          setUserName={setName}
          email={email}
          setEmail={setEmail}
          profileImage={profileImage}
          setProfileImageFile={setProfileImageFile}
          handleUpdateProfile={handleUpdateProfile}
        />

        {/* Admin-only button */}
        {user?.role === 'admin' && (
          <View style={styles.adminButtons}>
            <Pressable style={styles.adminButton} onPress={() => Linking.openURL('https://playmoodtv.com/admin')}>
              <Text style={styles.buttonText}>Admin Page</Text>
            </Pressable>
          </View>
        )}

        {/* Buttons for non-creators (admins and normal users) */}
        {user?.role !== 'creator' && (
          <View style={styles.adminButtons}>
            <Pressable style={styles.adminButton} onPress={() => navigation.navigate('ApplyAsCreator')}>
              <Text style={styles.buttonText}>Apply as a Creator</Text>
            </Pressable>
            <Pressable style={styles.adminButton} onPress={() => navigation.navigate('PostVideoForReview')}>
              <Text style={styles.buttonText}>Post a Video for Review</Text>
            </Pressable>
          </View>
        )}

        {/* Creator-only buttons */}
        {user?.role === 'creator' && (
          <View style={styles.adminButtons}>
            <Pressable style={styles.adminButton} onPress={() => navigation.navigate('CreatorPage', { creator: user })}>
              <Text style={styles.buttonText}>Visit Channel</Text>
            </Pressable>
            <Pressable style={styles.adminButton} onPress={() => navigation.navigate('PostVideoForReview')}>
              <Text style={styles.buttonText}>Upload a content for review</Text>
            </Pressable>
          </View>
        )}

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
            <Pressable style={styles.subButton} onPress={() => setSliderType('forYou')}>
              <FontAwesomeIcon icon={faUser} style={styles.icon} />
              <Text style={styles.buttonText}>For You</Text>
            </Pressable>
            <Pressable style={styles.subButton} onPress={() => setSliderType('watchlist')}>
              <FontAwesomeIcon icon={faEye} style={styles.icon} />
              <Text style={styles.buttonText}>Watchlist</Text>
            </Pressable>
            <Pressable style={styles.subButton} onPress={() => setSliderType('friends')}>
              <FontAwesomeIcon icon={faUser} style={styles.icon} />
              <Text style={styles.buttonText}>Friends</Text>
            </Pressable>
          </View>

          <View style={styles.dashSlider}>
            {renderSlider()}
          </View>
        </View>

          <View style={styles.boxHolder}>
            <View style={styles.boxText}>
              <FontAwesomeIcon icon={faHistory} style={styles.iconStyle} />
              <Text style={styles.boxInnerText}>Activities</Text>
            </View>
            <View style={styles.boxText}>
              <FontAwesomeIcon icon={faCookieBite} style={styles.iconStyle} />
              <Text style={styles.boxInnerText}>Manage Cookies</Text>
            </View>
            <View style={styles.boxText}>
              <FontAwesomeIcon icon={faTrash} style={styles.iconStyle} />
              <Text style={styles.boxInnerText}>Remove Cache</Text>
            </View>
          </View>
   
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  boxInnerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
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
  iconStyle: {
    color: 'white',
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
    justifyContent: 'evenly',
    alignItems: 'center',
    paddingLeft: 10,
    marginTop: 35,
  },
  subButton: {
    width: 70,
    height: 40,
    backgroundColor: '#541011',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
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
    alignItems: 'center',
    marginTop: 30,
    gap: 10,
  },
  boxText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    gap: 10,
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

