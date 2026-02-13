import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ContentDetailsScreen from '../screens/ContentDetailsScreen';

const Stack = createStackNavigator();

const TvNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ContentDetails" component={ContentDetailsScreen} />
    </Stack.Navigator>
  );
};

export default TvNavigator;
