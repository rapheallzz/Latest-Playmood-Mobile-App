import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';

const SliderHighlights = ({ highlights, handleSelectHighlight, recentHighlights, viewedHighlights }) => {
  return (
    <FlatList
      data={highlights}
      keyExtractor={(item) => item._id}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <Pressable onPress={() => handleSelectHighlight(item, index)}>
          <View style={[styles.card, (!recentHighlights.has(item._id) && viewedHighlights.has(item._id)) && styles.viewedCard]}>
            <Image source={{ uri: item.content.thumbnail }} style={styles.thumbnail} />
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
    card: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#f3f3f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
      },
      viewedCard: {
        borderColor: 'gray',
      },
      thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
      },
});

export default SliderHighlights;
