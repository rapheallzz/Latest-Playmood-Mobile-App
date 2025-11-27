import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Text, Dimensions } from 'react-native';
import MobileHeader from '../components/MobileHeader';
import { useNavigation } from '@react-navigation/native'; 
import LikeCard from '../components/LikeCard';
import NewOn from '../components/NewOn';
import Channel from '../components/Channel';
import Recommended from '../components/Recommended';
import Interview from '../components/Interviews';
import Diaries from '../components/Diaries';
import Spaces from '../components/Spaces';
import Top10Slider from '../components/TopSlider';
import Fashion from '../components/Fashion';
import Social from '../components/Social';
import Report from '../components/Report';
import Teen from '../components/Teen';
import tw from 'tailwind-react-native-classnames';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContent } from '../features/contentSlice';
import Behind from '../components/Behind';

const { width } = Dimensions.get('window');
const isTV = width >= 1024;

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [likecard, setLikeCard] = useState([1]);
  const user = useSelector((state) => state.user);
  const { contentList, isLoading } = useSelector((state) => state.content);

  const handleTop10Press = () => {
    navigation.navigate('ContentDetails');
  };

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-black`}>
        <Text style={tw`text-white`}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-black`}>
      <MobileHeader />
      <ScrollView showsHorizontalScrollIndicator={false} style={tw`flex-1 ml-10`}>
        <LikeCard data={likecard} />
        <View style={tw`flex mt-10`}>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Top10Slider data={contentList.filter(item => item.category === 'Top 10')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <NewOn data={contentList.filter(item => item.category === 'New On Playmood')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Channel data={contentList.filter(item => item.category === 'Channels')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Diaries data={contentList.filter(item => item.category === 'Diaries')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Spaces data={contentList.filter(item => item.category === 'Spaces')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Recommended data={contentList.filter(item => item.category === 'Recommended')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Interview data={contentList.filter(item => item.category === 'Interviews')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Fashion data={contentList.filter(item => item.category === 'Fashion')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Social data={contentList.filter(item => item.category === 'Social')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Report data={contentList.filter(item => item.category === 'Reports')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Behind data={contentList.filter(item => item.category === 'Behind the Scenes')} />
          </Pressable>
          <Pressable onPress={handleTop10Press} style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
            <Teen data={contentList.filter(item => item.category === 'Teen')} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
 