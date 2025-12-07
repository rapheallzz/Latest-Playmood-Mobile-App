import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Platform } from 'react-native';
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
import { useSelector } from 'react-redux';
import Behind from '../components/Behind';
import HighlightsHome from '../components/HighlightsHome';

const isTV = Platform.isTV;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [likecard, setLikeCard] = useState([1]);
  const user = useSelector((state) => state.user);

  const handleTop10Press = () => {
    navigation.navigate('ContentDetails');
  };

  useEffect(() => {
    if (!user.id) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  }, [user.id, navigation]);

  return (
    <View style={tw`flex-1 bg-black`}>
      {!isTV && <MobileHeader />}
      <ScrollView showsHorizontalScrollIndicator={false} style={tw`flex-1 ${isTV ? 'ml-0' : 'ml-10'}`}>
        {isTV && <View style={tw`h-16`} />}
        <LikeCard data={likecard} />
        <View style={tw`flex mt-10`}>
          {[Top10Slider, HighlightsHome, NewOn, Channel, Diaries, Spaces, Recommended, Interview, Fashion, Social, Report, Behind, Teen].map((Component, index) => (
            <TouchableOpacity
              key={index}
              onPress={handleTop10Press}
              style={tw`mr-4 ${isTV ? 'p-4' : 'p-2'}`}>
              <Component />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
 