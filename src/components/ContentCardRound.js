import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ContentKard = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('CreatorPage', { creator: item });
  };

  return (
    <Pressable onPress={handlePress}>
      <View>
        <Image
          source={{ uri: item.profileImage }}
          style={{ width: 100, height: 100, overflow: 'hidden', borderRadius: 50, marginBottom: 20 }}
        />
      </View>
    </Pressable>
  );
};

export default ContentKard;
