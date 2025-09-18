import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import playmood from '../../assets/PLAYMOOD_DEF.png';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { checkUserLoggedIn } from '../features/authSlice';

export default function SplashScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const resultAction = await dispatch(checkUserLoggedIn());
        if (checkUserLoggedIn.fulfilled.match(resultAction)) {
          if (resultAction.payload) {
            navigation.navigate('Home');
          } else {
            navigation.navigate('Welcome');
          }
        } else {
          navigation.navigate('Welcome');
        }
      } catch (error) {
        navigation.navigate('Welcome');
      }
    };

    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoHolder}>
        <Image source={playmood} style={styles.logo} />
        <Text style={styles.welcomeText}>Ready to Explore!!</Text>
      </View>
      <View style={styles.bottomText}>
        <Text style={styles.playVerison}>Playmood Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoHolder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 80,
  },
  welcomeText: {
    fontSize: 20,
    marginTop: 20,
  },
  bottomText: {
    position: 'absolute',
    bottom: 20,
  },
  playVerison: {
    fontSize: 14,
  },
});
