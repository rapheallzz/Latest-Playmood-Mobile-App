import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const isTV = Platform.isTV;

const LikeCard = () => {
  const [data, setData] = useState([]);
  const [contentIndex, setContentIndex] = useState(0);
  const [heartFocused, setHeartFocused] = useState(false);
  const [shareFocused, setShareFocused] = useState(false);
  const [playFocused, setPlayFocused] = useState(false);
  const [myListFocused, setMyListFocused] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/content/');
        setData(response.data);

        const interval = setInterval(() => {
          setContentIndex(prevIndex => (prevIndex + 1) % response.data.length);
        }, 30000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const currentContent = data[contentIndex];

  const handlePlayPress = () => {
    if (currentContent) {
      navigation.navigate('VideoScreen', {
        _id: currentContent._id,
        title: currentContent.title,
        credits: currentContent.credits,
        desc: currentContent.desc,
        movie: currentContent.movie,
      });
    }
  };

  return (
    <View style={styles.cardContainer}>
      {currentContent && (
        <Image
          source={{ uri: currentContent.thumbnail }}
          style={styles.backgroundImage}
        />
      )}

      <View style={styles.overlayContainer}>
        <View style={styles.topContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onFocus={() => setHeartFocused(true)}
              onBlur={() => setHeartFocused(false)}
            >
              <Image source={require('../../assets/whiteheart.png')} style={[styles.buttonicon, heartFocused && styles.focusedButton]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onFocus={() => setShareFocused(true)}
              onBlur={() => setShareFocused(false)}
            >
              <Image source={require('../../assets/share.png')} style={[styles.buttonicon, shareFocused && styles.focusedButton]} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.overlayTextContainer}>
            <Text style={styles.buttonText}>{currentContent ? currentContent.title : 'Loading...'}</Text>
            <Text style={styles.buttonTextCat}>{currentContent ? currentContent.category : ''}</Text>
          </View>
          <View style={styles.overlayButtonsContainer}>
            <TouchableOpacity
              style={[styles.iconButton, playFocused && styles.focusedButton]}
              onPress={handlePlayPress}
              onFocus={() => setPlayFocused(true)}
              onBlur={() => setPlayFocused(false)}
            >
              <Image source={require('../../assets/play-button.png')} style={styles.icon} />
              <Text style={styles.iconText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, myListFocused && styles.focusedButton]}
              onFocus={() => setMyListFocused(true)}
              onBlur={() => setMyListFocused(false)}
            >
              <Image source={require('../../assets/plus.png')} style={styles.icon} />
              <Text style={styles.iconText}>My List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: isTV ? '80%' : '90%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: isTV ? 40 : 10,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  bottomContainer: {
    padding: 10,
  },
  overlayTextContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  overlayButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 2,
  },
  buttonTextCat: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: isTV ? 20 : 14,
    paddingTop: 10,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    height: isTV ? 50 : 30,
    justifyContent: 'center',
  },
  icon: {
    width: isTV ? 30 : 20,
    height: isTV ? 30 : 20,
    marginRight: 5,
  },
  iconText: {
    color: 'black',
    fontSize: isTV ? 18 : 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 3,
  },
  buttonicon: {
    width: isTV ? 30 : 20,
    height: isTV ? 30 : 20,
  },
  buttonText: {
    color: 'white',
    fontSize: isTV ? 24 : 14,
  },
  focusedButton: {
    transform: [{ scale: 1.1 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default LikeCard;
