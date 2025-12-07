import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CommentSection from '../components/CommentSection';
import { VideoView, useVideoPlayer } from 'expo-video';
import Recommended from '../components/Recommended';
import Watching from '../components/Watching';
import playmood from '../../assets/PLAYMOOD_DEF.png';
import profile from '../../assets/icon-profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faEye, faBell, faDollarSign, faLink, faPlay, faComment } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { likeContent, unlikeContent, addToFavorites } from '../features/contentSlice';

const isTV = Platform.isTV;

const VideoScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { title, credits, desc, movie, _id } = route.params;
  const user = useSelector((state) => state.user);
  const userId = user ? user._id : null;

  const player = useVideoPlayer(movie, (player) => {
    player.loop = true;
    player.play();
  });

  const handleNextPress = () => {
    navigation.navigate('NextVideoPage');
  };

  const { likes } = useSelector((state) => state.content);
  const [isLiked, setIsLiked] = useState([]);
  const [isCommentSectionOpen, setCommentSectionOpen] = useState(false);

  useEffect(() => {
    setIsLiked(likes.map((like) => like.contentId));
  }, [likes]);

  const handleTop10Press = () => {
    navigation.navigate('ContentDetails');
  };

  const handleLikePress = (contentId) => {
    if (isLiked.includes(contentId)) {
      dispatch(unlikeContent(contentId));
    } else {
      dispatch(likeContent(contentId));
    }
  };

  const handleFavoritePress = () => {
    if (userId) {
      dispatch(addToFavorites({ contentId: _id, userId }));
    } else {
      console.log('User not logged in');
    }
  };

  const handleCommentIconClick = () => {
    setCommentSectionOpen(true);
  };

  if (isTV) {
    return (
      <View style={styles.container}>
        <View style={styles.tvVideoContainer}>
          <VideoView style={styles.tvVideo} player={player} allowsFullscreen nativeControls />
          <View style={styles.tvOverlay}>
            <View style={styles.tvTopOverlay}>
              <Text style={styles.tvTitle}>{title}</Text>
              <View style={styles.tvTopIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Image source={playmood} style={styles.tvLogo} />
                </TouchableOpacity>
                {user && user._id && (
                  <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Image source={profile} style={styles.tvProfileIcon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.tvBottomOverlay}>
              <View style={styles.tvBottomIcons}>
                <View style={styles.flexIt}>
                  <FontAwesomeIcon icon={faEye} style={styles.tvIcon} />
                  <Text style={styles.tvInfobuttonText}>0</Text>
                </View>
                <TouchableOpacity style={styles.flexIt} onPress={() => handleLikePress(_id)}>
                  <FontAwesomeIcon icon={faHeart} style={{color: (route.params.isLiked || isLiked.includes(_id)) ? 'red' : 'white'}} />
                  <Text style={styles.tvInfobuttonText}>{route.params.likesCount || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.flexIt} onPress={handleCommentIconClick}>
                  <FontAwesomeIcon icon={faComment} style={styles.tvIcon} />
                  <Text style={styles.tvInfobuttonText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <FontAwesomeIcon icon={faLink} style={styles.tvIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.tvButtonHolder}>
                <TouchableOpacity style={styles.tvSubButton} onPress={() => player.replay()}>
                  <FontAwesomeIcon icon={faPlay} style={styles.tvIcon} />
                  <Text style={styles.tvButtonText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tvSubButton} onPress={handleNextPress}>
                  <Text style={styles.tvButtonText}>NEXT VIDEO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Recommended />
          <Watching />
        </ScrollView>
        {isCommentSectionOpen && (
          <CommentSection
            contentId={_id}
            isVisible={isCommentSectionOpen}
            onClose={() => setCommentSectionOpen(false)}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoHeader}>
        <View style={styles.titleHolder}>
          <Text style={styles.redTitle}> {title} </Text>
        </View>
        <View style={styles.imageHolder}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={playmood} style={styles.logo} />
          </TouchableOpacity>
          {user && user._id && (
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Image source={profile} style={styles.profileIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsHorizontalScrollIndicator={false} style={styles.content}>
        <View style={styles.videoContainer}>
          <VideoView style={styles.video} player={player} allowsFullscreen nativeControls />
        </View>

        <View style={styles.contentData}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={styles.infoTitle}>Title: {title}</Text>
              <View style={styles.iconHolder}>
                <View style={styles.flexIt}>
                  <FontAwesomeIcon icon={faEye} style={styles.icon} />
                  <Text style={styles.infobuttonText}>0</Text>
                </View>
                <TouchableOpacity style={styles.flexIt} onPress={() => handleLikePress(_id)}>
                  <FontAwesomeIcon icon={faHeart} style={{color: (route.params.isLiked || isLiked.includes(_id)) ? 'red' : 'white'}} />
                  <Text style={styles.infobuttonText}>{route.params.likesCount || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.flexIt} onPress={handleCommentIconClick}>
                  <FontAwesomeIcon icon={faComment} style={styles.icon} />
                  <Text style={styles.infobuttonText}>0</Text>
                </TouchableOpacity>
                <View>
                  <FontAwesomeIcon icon={faLink} style={styles.icon} />
                </View>
              </View>
            </View>
            <View style={styles.buttonHolder}>
              <TouchableOpacity style={styles.subButton} onPress={() => player.replay()}>
                <FontAwesomeIcon icon={faPlay} style={styles.icon} />
                <Text style={styles.buttonText}>Play Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subButton} onPress={handleNextPress}>
                <Text style={styles.buttonText}>NEXT VIDEO</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonHolder}></View>
            <View style={styles.buttonHolder}>
              <TouchableOpacity style={styles.subButton}>
                <Text style={styles.buttonText}>By: {credits}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subButton}>
                <FontAwesomeIcon icon={faDollarSign} style={styles.icon} />
                <Text style={styles.buttonText}>Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.subButton}>
                <FontAwesomeIcon icon={faBell} style={styles.icon} />
                <Text style={styles.buttonText}>Subscribe</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <View style={styles.navButton}>
              <Text style={styles.infobuttonText}>Information</Text>
              <TouchableOpacity style={styles.switchButton} onPress={handleNextPress}>
                <Text style={styles.nextbuttonText}>Production ~ Credits</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoNav}>
              <Text style={styles.credits}>{credits}</Text>
              <Text style={styles.description}>{desc}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleTop10Press}>
          <Recommended />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTop10Press}>
          <Watching />
        </TouchableOpacity>
      </ScrollView>
      {isCommentSectionOpen && (
        <CommentSection
          contentId={_id}
          isVisible={isCommentSectionOpen}
          onClose={() => setCommentSectionOpen(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  videoHeader:{
   width: '100%',
   height: 90,
   flexDirection:'row',
   alignItems: 'center',
  },

  flexIt: {
    flexDirection:'row',
    gap: 5,
  },
  // buggerHolder : {
  // width:50,
  // height: 50,
  // paddingRight: 20,

  // },

  iconHolder: {
     flexDirection:'row',
      justifyContent:'space-evenly'
  },


  titleHolder:{
    width: 145,
    height: 40,
    backgroundColor: 'red',
    borderBottomRightRadius: 25,
    padding:6,
    marginHorizontal:20,

  } ,
  redTitle: {
      fontSize: 7.5,
      color:'white'
  },
  
  imageHolder : {
    width: 40,
    flexDirection:'row',
    alignItems: 'center',
    paddingLeft:10,
  },
  logo: {
    width: 110,
    height: 25,
  },
  profileIcon: {
    width: 20,
    height: 20,
    borderRadius: 15,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loadingIndicator: {
    position: 'absolute',
    zIndex: 1,
  },
  video: {
    width: '100%',
    height: 200,
  
  },
  contentData:{
  
    width: '90%',
    height: 'auto', 
    flexDirection:'column',
    justifyContent:'center',
    marginVertical:20,
    alignItems:'center',
   
   
  },

  navButton:{
    width:200,
    height: 30, // Adjust height as needed
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:50,
  },

  nextButton: {
    width: 100,
    height: 30,
    backgroundColor: '#541011',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subButton: {
    width: 95,
    height: 30,
    flexDirection: 'row',
    backgroundColor: '#541011',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop:10,
    marginRight:10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    color:'white',
    fontSize: 5,
  },
  switchButton: {
    width: 120,
    height: 30,
    backgroundColor: '#541011',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop:10,
  },
  
  
  duration: {
    color: 'white',
    paddingVertical: 5,
    fontSize: 13,
  },
  playButton:{
    paddingVertical: 5,
  },

  playIcon: {
    width: 15,
    height: 15,
    borderRadius: 15,
  },
  playText: {
    color: 'white',
    fontSize: 13,
  },

  info:{
   color:'white',
   fontSize:20,
   marginBottom:15,
   marginTop:10,
  },
  infoTitle: {
    color: 'white',
    fontSize: 13,
  },

  titleContainer: {
   alignItems:'center',
  },
   
  infoNav :{
    marginTop: 50,
    marginHorizontal: 10,
  },

  buttonHolder: {
    flexDirection:'row'
  },

  title: {
    marginTop:50,
    color: 'white',
    fontSize: 13,
  },
  credits: {
    color: 'white',
    fontSize: 13,
    textAlign:'center'
  },
  description: {
    color: 'white',
    fontSize: 12,
    marginTop: 10,
    overflow: 'scroll',
    textAlign:'center',
    
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  watchButton: {
    backgroundColor: '#541011',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },


  buttonText: {
    color: 'white',
    fontSize: 9,
  },
  nextbuttonText: {
    color: 'white',
    fontSize: 9,
  },
  infobuttonText: {
    color: 'white',
    fontSize: 12,
  },
  content: {
    flex: 1,
    marginLeft: 20,
    backgroundColor: 'black',
  },
  tvVideoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  tvVideo: {
    width: '100%',
    height: '100%',
  },
  tvOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
  },
  tvTopOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tvTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tvTopIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tvLogo: {
    width: 150,
    height: 35,
    marginRight: 20,
  },
  tvProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tvBottomOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tvBottomIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  tvIcon: {
    color: 'white',
    fontSize: 24,
  },
  tvInfobuttonText: {
    color: 'white',
    fontSize: 18,
  },
  tvButtonHolder: {
    flexDirection: 'row',
    gap: 10,
  },
  tvSubButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    gap: 10,
  },
  tvButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default VideoScreen;
