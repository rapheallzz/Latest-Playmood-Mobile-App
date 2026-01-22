import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { VideoView, useVideoPlayer } from 'expo-video';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { fetchTodaySchedule } from '../features/scheduleSlice';
import MobileHeader from '../components/MobileHeader';

const { width } = Dimensions.get('window');

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { liveProgram, upcomingPrograms, isLoading } = useSelector((state) => state.schedule);
  const [liveEdge, setLiveEdge] = useState(0);
  const refreshTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTodaySchedule());

    const interval = setInterval(() => {
      setLiveEdge((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, [dispatch]);

  useEffect(() => {
    if (liveProgram) {
      setLiveEdge(liveProgram.currentPlaybackTime);

      const duration = liveProgram.contentId?.duration || 0;
      const remaining = duration - liveProgram.currentPlaybackTime;

      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      if (remaining > 0) {
        refreshTimeoutRef.current = setTimeout(() => {
          dispatch(fetchTodaySchedule());
        }, remaining * 1000);
      }
    }
  }, [liveProgram, dispatch]);

  const player = useVideoPlayer(liveProgram?.contentId?.video || null, (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    if (player && liveProgram) {
      player.currentTime = liveProgram.currentPlaybackTime;
    }
  }, [player, liveProgram]);

  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener('timeUpdate', (event) => {
      if (event.currentTime > liveEdge) {
        player.currentTime = liveEdge;
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, liveEdge]);

  const handleProgramClick = (program) => {
    const content = program.contentId;
    if (content?._id) {
      navigation.navigate('VideoScreen', {
        _id: content._id,
        movie: content.video,
        title: content.title || '',
        desc: content.description || '',
        credits: content.credit || '',
      });
    }
  };

  if (isLoading && !liveProgram) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b51315" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MobileHeader />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandHeader}>
          <Text style={styles.brandText}>
            <Text style={styles.playmood}>PLAYMOOD</Text>
            <Text style={styles.tv}>TV</Text>
          </Text>
        </View>

        <View style={styles.layout}>
          {/* Player Section */}
          <View style={styles.playerColumn}>
            {liveProgram ? (
              <View style={styles.playerWrapper}>
                <View style={styles.liveBadge}>
                  <View style={styles.dot} />
                  <Text style={styles.liveBadgeText}>LIVE NOW</Text>
                </View>
                <VideoView
                  style={styles.video}
                  player={player}
                  nativeControls
                  allowsFullscreen
                />
                <View style={styles.programDetails}>
                  <Text style={styles.programTitle}>{liveProgram.contentId?.title}</Text>
                  <Text style={styles.programDesc}>{liveProgram.contentId?.description}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.stayTunedContainer}>
                <MaterialIcons name="error-outline" size={64} color="#541011" />
                <Text style={styles.stayTunedTitle}>STAY TUNED</Text>
                <Text style={styles.stayTunedDesc}>
                  No program is currently on air. Check the guide for upcoming content.
                </Text>
              </View>
            )}
          </View>

          {/* Schedule Section */}
          <View style={styles.scheduleColumn}>
            <View style={styles.guideHeader}>
              <Text style={styles.sectionTitle}>TV Guide</Text>
              <Text style={styles.todayLabel}>Today's Schedule</Text>
            </View>

            <View style={styles.verticalList}>
              {/* Live Item */}
              {liveProgram && (
                <View style={[styles.guideItem, styles.activeGuideItem]}>
                  <View style={styles.timeCol}>
                    <Text style={[styles.timeText, styles.activeTimeText]}>
                      {liveProgram.startTime}
                    </Text>
                    <Text style={styles.statusText}>ON AIR</Text>
                  </View>
                  <View style={styles.contentCol}>
                    <Text style={[styles.itemTitle, styles.activeItemTitle]} numberOfLines={1}>
                      {liveProgram.contentId?.title}
                    </Text>
                    <Text style={styles.categoryText}>{liveProgram.contentId?.category}</Text>
                  </View>
                </View>
              )}

              {/* Upcoming Items */}
              {upcomingPrograms.length > 0 ? (
                upcomingPrograms.map((program) => (
                  <TouchableOpacity
                    key={program._id}
                    style={styles.guideItem}
                    onPress={() => handleProgramClick(program)}
                  >
                    <View style={styles.timeCol}>
                      <Text style={styles.timeText}>{program.startTime}</Text>
                    </View>
                    <View style={styles.contentCol}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {program.contentId?.title}
                      </Text>
                      <Text style={[styles.categoryText, { color: '#555' }]}>
                        {program.contentId?.category}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : !liveProgram ? (
                <Text style={styles.noGuide}>No programs scheduled for today.</Text>
              ) : null}
            </View>
          </View>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  brandHeader: {
    padding: 20,
    marginTop: 10,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  playmood: {
    color: '#b51315',
  },
  tv: {
    color: '#fff',
  },
  layout: {
    paddingHorizontal: 15,
  },
  playerColumn: {
    marginBottom: 30,
  },
  playerWrapper: {
    position: 'relative',
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 15,
  },
  liveBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#541011',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginRight: 6,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  programDetails: {
    marginTop: 15,
  },
  programTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  programDesc: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  stayTunedContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#111',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    textAlign: 'center',
  },
  stayTunedTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 15,
    marginBottom: 10,
  },
  stayTunedDesc: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  scheduleColumn: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20,
  },
  guideHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  todayLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  verticalList: {
    gap: 15,
  },
  guideItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    gap: 15,
  },
  activeGuideItem: {
    backgroundColor: 'rgba(84, 16, 17, 0.1)',
    borderWidth: 1,
    borderColor: '#541011',
  },
  timeCol: {
    width: 60,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  activeTimeText: {
    color: '#541011',
  },
  statusText: {
    color: '#541011',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 2,
  },
  contentCol: {
    flex: 1,
  },
  itemTitle: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  activeItemTitle: {
    color: '#fff',
  },
  categoryText: {
    color: '#541011',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  noGuide: {
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 30,
  },
});
