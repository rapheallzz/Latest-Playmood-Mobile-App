import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const DonationScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Text style={tw`text-white text-2xl`}>Donation Screen</Text>
    </View>
  );
};

export default DonationScreen;
