import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, Pressable, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const LikeCard = () => {
  const [data, setData] = useState([]);
  const [contentIndex, setContentIndex] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/content/');
        setData(response.data);

        // Start content rotation
        const interval = setInterval(() => {
          setContentIndex(prevIndex => (prevIndex + 1) % response.data.length);
        }, 30000); // Rotate every 30 seconds

        return () => clearInterval(interval); // Cleanup on unmount
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const currentContent = data[contentIndex];

  const handlePlayPress = () => {
    navigation.navigate('VideoScreen', { content: currentContent });
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
            <Pressable style={styles.button}>
              <Image source={require('../../assets/whiteheart.png')} style={styles.buttonicon} />
            </Pressable>
            <Pressable style={styles.button}>
              <Image source={require('../../assets/share.png')} style={styles.buttonicon} />
            </Pressable>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.overlayTextContainer}>
            <Text style={styles.buttonText}>{currentContent ? currentContent.title : 'Loading...'}</Text>
            <Text style={styles.buttonTextCat}>{currentContent ? currentContent.category : ''}</Text>
          </View>
          <View style={styles.overlayButtonsContainer}>
            <Pressable style={styles.iconButton} onPress={handlePlayPress}>
              <Image source={require('../../assets/play-button.png')} style={styles.icon} />
              <Text style={styles.iconText}>Play</Text>
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Image source={require('../../assets/plus.png')} style={styles.icon} />
              <Text style={styles.iconText}>My List</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.6,
    height: height * 0.6,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    marginLeft: 60,
    marginTop: 10,
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
    fontSize: 14,
    paddingTop: 10,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    height: 30,
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  iconText: {
    color: 'black',
    fontSize: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 3,
  },
  buttonicon: {
    width: 20,
    height: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default LikeCard;
