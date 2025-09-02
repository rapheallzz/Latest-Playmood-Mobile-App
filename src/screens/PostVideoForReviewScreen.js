import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const PostVideoForReviewScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Text style={tw`text-white text-2xl`}>Post Video for Review Screen</Text>
    </View>
  );
};

export default PostVideoForReviewScreen;
