import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import ContentCard from './ContentCard';

const { width: screenWidth } = Dimensions.get('window');

const NewOn = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.headerText}>New On Playmood</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <ContentCard item={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 350,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 20,
    marginTop: 12,
    marginBottom: 5,
  },
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    height: 600,
  },
  scrollViewContainer: {
    paddingHorizontal: 15,
  },
});

export default NewOn;
