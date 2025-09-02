import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const SubscriptionScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Text style={tw`text-white text-2xl`}>Subscription Screen</Text>
    </View>
  );
};

export default SubscriptionScreen;
