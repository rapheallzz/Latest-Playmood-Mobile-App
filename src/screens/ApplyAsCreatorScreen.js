import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const ApplyAsCreatorScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Text style={tw`text-white text-2xl`}>Apply as Creator Screen</Text>
    </View>
  );
};

export default ApplyAsCreatorScreen;
