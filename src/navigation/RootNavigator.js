import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { Platform } from 'react-native';
import { checkUserLoggedIn } from '../features/authSlice';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import TvNavigator from './TvNavigator';
import SplashScreen from '../screens/SplashScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { userToken, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserLoggedIn());
  }, [dispatch]);

  const MainNavigator = Platform.isTV ? TvNavigator : AppNavigator;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : userToken ? (
          <Stack.Screen name="App" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
