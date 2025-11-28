import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { API_URL, IMAGE_BASE_URL } from '../constants';
import playmood from '../../assets/PLAYMOOD_DEF.png';

const DynamicImage = () => {
  const [imageSource, setImageSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const hallsWithImages = data.data.data.filter(hall => hall.images && hall.images.length > 0);

        if (hallsWithImages.length > 0) {
          const randomIndex = Math.floor(Math.random() * hallsWithImages.length);
          const randomHall = hallsWithImages[randomIndex];
          const image = randomHall.images[0];
          const fullImageUrl = `${IMAGE_BASE_URL}${image.replace(/\\/g, '/')}`;
          setImageSource({ uri: fullImageUrl });
        } else {
          setImageSource(playmood);
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setImageSource(playmood);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
           <Image source={playmood} style={styles.image} resizeMode="cover" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#cccccc',
  },
});

export default DynamicImage;
