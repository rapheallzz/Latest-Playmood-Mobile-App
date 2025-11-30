import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import useHighlights from '../features/useHighlights';

const HighlightsSection = ({ user, creatorId, onSelectHighlight }) => {
  const { highlights, isLoading, error } = useHighlights(user, creatorId);
  const [viewedHighlights, setViewedHighlights] = useState(new Set());

  if (isLoading) {
    return <Text style={styles.loadingText}>Loading highlights...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Highlights</Text>
      <FlatList
        data={highlights}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => onSelectHighlight(item, index)}>
            <View style={[styles.card, viewedHighlights.has(item._id) && styles.viewedCard]}>
              <Image source={{ uri: item.content.thumbnail }} style={styles.thumbnail} />
            </View>
            <Text style={styles.highlightTitle} numberOfLines={2}>
              {item.content.title}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
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
  highlightTitle: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    width: 80,
  },
});

export default HighlightsSection;
