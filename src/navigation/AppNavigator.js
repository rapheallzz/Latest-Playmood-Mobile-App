import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import VideoScreen from '../screens/VideoScreen';
import CreatorChannel from '../screens/ChannelScreen';
import UploadScreen from '../screens/UploadScreen';
import ContentDetailsScreen from '../screens/ContentDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreatorPage" component={CreatorChannel} options={{ headerShown: false }} />
      <Stack.Screen name="PostVideoForReview" component={UploadScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ContentDetails" component={ContentDetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
