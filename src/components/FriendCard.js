import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const FriendCard = ({ friend }) => {
  return (
    <View style={styles.card}>
      <Image
        source={friend.profileImage ? { uri: friend.profileImage } : require('../../assets/images/10.png')}
        style={styles.profileImage}
      />
      <Text style={styles.friendName}>{friend.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  friendName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FriendCard;
