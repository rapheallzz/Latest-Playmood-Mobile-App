import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Modal, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import playmood from '../../assets/PLAYMOOD_DEF.png';
import profile from '../../assets/icon-profile.png';
import settings from '../../assets/settings-icon.png';
import settings_red from '../../assets/settings-red-icon.png';
import search from '../../assets/search.png';
import recommended from '../../assets/recommended.png';
import newp from '../../assets/newp.png';
import snowflakes from '../../assets/snowflakes.png';
import schedule from '../../assets/schedule.png';
import favourite from '../../assets/favourite.png';
import categories from '../../assets/categories.png';
import home from '../../assets/home.png';
import search_icon from '../../assets/search_white.png';
import search_red from '../../assets/search_red.png';
import thumbs from '../../assets/thumbs.png';
import thumbs_red from '../../assets/thumbs_red.png';
import location from '../../assets/location_white.png';
import home_red from '../../assets/home_red.png';
import newp_red from '../../assets/newp_red.png';
import snowflakes_red from '../../assets/snowflakes_red.png';
import location_red from '../../assets/location.png';
import schedule_white from '../../assets/schedule_white.png';
import schedule_red from '../../assets/schedule_red.png';
import plus from '../../assets/plus.png';
import plusbutton from '../../assets/plus-button.png';
import favourite_red from '../../assets/star_red.png';
import Top10Slider from './TopSlider';
import NewOn from './NewOn';
import Channel from './Channel';
import Diaries from './Diaries';
import Spaces from './Spaces';
import Recommended from './Recommended';
import Interviews from './Interviews';
import Fashion from './Fashion';
import Report from './Report';
import Behind from './Behind';
import Teen from './Teen';
import WatchlistSlider from './WatchlistSlider';

export default function MobileHeader({ channels, set_channels }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [top10Toggled, setTop10Toggled] = useState(false);
  const [newPlaymoodToggled, setNewPlaymoodToggled] = useState(false);
  const [channelsToggled, setChannelsToggled] = useState(false);
  const [diariesToggled, setDiariesToggled] = useState(false);
  const [spacesToggled, setSpacesToggled] = useState(false);
  const [recommendationsToggled, setRecommendationsToggled] = useState(false);
  const [interviewsToggled, setInterviewsToggled] = useState(false);
  const [fashionShowsToggled, setFashionShowsToggled] = useState(false);
  const [documentariesToggled, setDocumentariesToggled] = useState(false);
  const [behindTheCamerasToggled, setBehindTheCamerasToggled] = useState(false);
  const [soonInPlaymoodToggled, setSoonInPlaymoodToggled] = useState(false);
  const [teenToggled, setTeenToggled] = useState(false);
  const [bestInFashionToggled, setBestInFashionToggled] = useState(false);
  const [onlyInPlaymoodToggled, setOnlyInPlaymoodToggled] = useState(false);
  const [watchlistToggled, setWatchlistToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleIconClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const closeAllCategories = (excludeSetter) => {
    if (excludeSetter !== setTop10Toggled) setTop10Toggled(false);
    if (excludeSetter !== setNewPlaymoodToggled) setNewPlaymoodToggled(false);
    if (excludeSetter !== setChannelsToggled) setChannelsToggled(false);
    if (excludeSetter !== setDiariesToggled) setDiariesToggled(false);
    if (excludeSetter !== setSpacesToggled) setSpacesToggled(false);
    if (excludeSetter !== setRecommendationsToggled) setRecommendationsToggled(false);
    if (excludeSetter !== setInterviewsToggled) setInterviewsToggled(false);
    if (excludeSetter !== setFashionShowsToggled) setFashionShowsToggled(false);
    if (excludeSetter !== setDocumentariesToggled) setDocumentariesToggled(false);
    if (excludeSetter !== setBehindTheCamerasToggled) setBehindTheCamerasToggled(false);
    if (excludeSetter !== setSoonInPlaymoodToggled) setSoonInPlaymoodToggled(false);
    if (excludeSetter !== setTeenToggled) setTeenToggled(false);
    if (excludeSetter !== setBestInFashionToggled) setBestInFashionToggled(false);
    if (excludeSetter !== setOnlyInPlaymoodToggled) setOnlyInPlaymoodToggled(false);
    if (excludeSetter !== setWatchlistToggled) setWatchlistToggled(false);
  };

  const handleToggleFactory = (setter, state) => () => {
    if (state) {
      setter(false);
    } else {
      closeAllCategories(setter);
      setter(true);
    }
  };

  const handleTop10Toggle = handleToggleFactory(setTop10Toggled, top10Toggled);
  const handleNewPlaymoodToggle = handleToggleFactory(setNewPlaymoodToggled, newPlaymoodToggled);
  const handleChannelsToggle = handleToggleFactory(setChannelsToggled, channelsToggled);
  const handleDiariesToggle = handleToggleFactory(setDiariesToggled, diariesToggled);
  const handleSpacesToggle = handleToggleFactory(setSpacesToggled, spacesToggled);
  const handleRecommendationsToggle = handleToggleFactory(setRecommendationsToggled, recommendationsToggled);
  const handleInterviewsToggle = handleToggleFactory(setInterviewsToggled, interviewsToggled);
  const handleFashionShowsToggle = handleToggleFactory(setFashionShowsToggled, fashionShowsToggled);
  const handleDocumentariesToggle = handleToggleFactory(setDocumentariesToggled, documentariesToggled);
  const handleBehindTheCamerasToggle = handleToggleFactory(setBehindTheCamerasToggled, behindTheCamerasToggled);
  const handleSoonInPlaymoodToggle = handleToggleFactory(setSoonInPlaymoodToggled, soonInPlaymoodToggled);
  const handleTeenToggle = handleToggleFactory(setTeenToggled, teenToggled);
  const handleBestInFashionToggle = handleToggleFactory(setBestInFashionToggled, bestInFashionToggled);
  const handleOnlyInPlaymoodToggle = handleToggleFactory(setOnlyInPlaymoodToggled, onlyInPlaymoodToggled);
  const handleWatchlistToggle = handleToggleFactory(setWatchlistToggled, watchlistToggled);

  return (
    <View style={styles.mobileHeader}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable onPress={() => navigation.navigate('Home')}>
              <Image source={playmood} style={styles.logo} />
            </Pressable>
            {user && user._id && (
              <Pressable onPress={() => navigation.navigate('Dashboard')}>
                <Image source={profile} style={styles.profileIcon} />
              </Pressable>
            )}
          </View>
          <Pressable onPress={toggleSidebar}>
            <FontAwesome name="bars" size={30} color="white" />
          </Pressable>
        </View>

        {/* Horizontal Navigation Links */}
        <View style={styles.navigation}>
          <Pressable style={styles.link} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.linkText}>HOME</Text>
          </Pressable>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>CHANNELS</Text>
          </Pressable>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>SCHEDULE</Text>
          </Pressable>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>SPACES</Text>
          </Pressable>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>STORIES</Text>
          </Pressable>
          <Pressable style={styles.link}>
            <Text style={styles.linkText}>DIARIES</Text>
          </Pressable>
        </View>
      </View>

      {/* Sidebar */}
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <View style={styles.dropdownArea}>

            <Pressable onPress={handleIconClick}>
              <Image source={search_icon} style={styles.icon} />
            </Pressable>
            <Pressable onPress={handleIconClick}>
              <Image source={home} style={styles.icon} />
            </Pressable>
            <Pressable onPress={handleIconClick}>
              <Image source={thumbs} style={styles.icon} />
            </Pressable>
            <Pressable onPress={handleIconClick}>
              <Image source={newp} style={styles.icon} />
            </Pressable>
            <Pressable onPress={handleIconClick}>
              <Image source={snowflakes} style={styles.icon} />
            </Pressable>
            <Pressable onPress={handleIconClick}>
              <Image source={location} style={styles.icon} />
            </Pressable>
            <Pressable onPress={handleIconClick}>
              <Image source={schedule_white} style={styles.icon} />
            </Pressable>
            <Pressable onPress={handleIconClick}>
              <Image source={favourite} style={styles.icon} />
            </Pressable>
            <Pressable onPress={() => setCategoryModalVisible(true)}>
              <Image source={plus} style={styles.icon} />
            </Pressable>
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Pressable style={styles.closeButton} onPress={() => setCategoryModalVisible(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>
          <ScrollView>
            <View style={styles.categoriesContainer}>
              <Pressable onPress={handleTop10Toggle}><Text style={styles.categoryText}>TOP 10</Text></Pressable>
              {top10Toggled && <Top10Slider />}
              <Pressable onPress={handleNewPlaymoodToggle}><Text style={styles.categoryText}>New on Playmood</Text></Pressable>
              {newPlaymoodToggled && <NewOn />}
              <Pressable onPress={handleChannelsToggle}><Text style={styles.categoryText}>Channels</Text></Pressable>
              {channelsToggled && <Channel />}
              <Pressable onPress={handleDiariesToggle}><Text style={styles.categoryText}>Diaries</Text></Pressable>
              {diariesToggled && <Diaries />}
              <Pressable onPress={handleSpacesToggle}><Text style={styles.categoryText}>Spaces</Text></Pressable>
              {spacesToggled && <Spaces />}
              <Pressable onPress={handleRecommendationsToggle}><Text style={styles.categoryText}>Recommendations for you</Text></Pressable>
              {recommendationsToggled && <Recommended />}
              <Pressable onPress={handleInterviewsToggle}><Text style={styles.categoryText}>Interviews</Text></Pressable>
              {interviewsToggled && <Interviews />}
              <Pressable onPress={handleFashionShowsToggle}><Text style={styles.categoryText}>Fashion Shows Stories</Text></Pressable>
              {fashionShowsToggled && <Fashion />}
              <Pressable onPress={handleDocumentariesToggle}><Text style={styles.categoryText}>Documentaries and Reports</Text></Pressable>
              {documentariesToggled && <Report />}
              <Pressable onPress={handleBehindTheCamerasToggle}><Text style={styles.categoryText}>Behind the cameras</Text></Pressable>
              {behindTheCamerasToggled && <Behind />}
              <Pressable onPress={handleSoonInPlaymoodToggle}><Text style={styles.categoryText}>Soon in Playmood</Text></Pressable>
              {soonInPlaymoodToggled && <Text style={styles.comingSoonText}>Coming soon...</Text>}
              <Pressable onPress={handleTeenToggle}><Text style={styles.categoryText}>Teen</Text></Pressable>
              {teenToggled && <Teen />}
              <Pressable onPress={handleBestInFashionToggle}><Text style={styles.categoryText}>Best in Fashion</Text></Pressable>
              {bestInFashionToggled && <Fashion />}
              <Pressable onPress={handleOnlyInPlaymoodToggle}><Text style={styles.categoryText}>Only in Playmood</Text></Pressable>
              {onlyInPlaymoodToggled && <Text style={styles.comingSoonText}>Coming soon...</Text>}
              <Pressable onPress={handleWatchlistToggle}><Text style={styles.categoryText}>Watchlist</Text></Pressable>
              {watchlistToggled && <WatchlistSlider />}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal for "Coming soon" message */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Coming soon on playmood App</Text>
            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileHeader: {
    height: 140,
    width: '100%',
    backgroundColor: 'black',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    position: 'relative',
    zIndex: 1001,
  },
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    width: '100%',
    height: 80,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 120,
    height: 30,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 10,
  },
  link: {
    paddingHorizontal: 5,
  },
  linkText: {
    color: 'white',
    fontSize: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 140, // Adjust based on header height
    left: 0,
    height: '100%',
    width: 200,
    zIndex: 1000,
    paddingVertical: 20,
    backgroundColor: 'black',
  },
  dropdownArea: {
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    paddingHorizontal: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoriesScrollView: {
    maxHeight: '100%',
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    paddingVertical: 8,
  },
  comingSoonText: {
    color: 'gray',
    fontSize: 12,
    paddingVertical: 8,
    paddingLeft: 10,
  },
});
