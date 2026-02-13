import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const ContentDetailsScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Text style={tw`text-white text-2xl`}>Coming Soon</Text>
    </View>
  );
};

export default ContentDetailsScreen;
