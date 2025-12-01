import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopTenContent } from '../features/contentSlice';
import ContentCard from './ContentCard';

const { width: screenWidth } = Dimensions.get('window');

const Top10Slider = () => {
  const dispatch = useDispatch();
  const { topTenContent, isLoading, isError, message } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchTopTenContent());
  }, [dispatch]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  if (isError) {
    return <Text style={{ color: 'white' }}>{message}</Text>;
  }

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.headerText}>TOP 10</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {topTenContent.map((item, index) => (
          <View key={item._id} style={styles.itemContainer}>
            <View style={styles.numberingContainer}>
              <Text style={styles.numberingText}>{index + 1}</Text>
            </View>
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
  numberingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 25,
    marginBottom: 5,
  },
  numberingText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  scrollViewContainer: {
    paddingHorizontal: 15,
  },
});

export default Top10Slider;
