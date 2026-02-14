import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import SliderHighlights from './SliderHighlights';
import VerticalHighlightViewer from './VerticalHighlightViewer';
import BASE_API_URL from '../apiConfig';

const HighlightsHome = () => {
  const [highlights, setHighlights] = useState([]);
  const [recentHighlights, setRecentHighlights] = useState(new Set());
  const [creators, setCreators] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewedHighlights, setViewedHighlights] = useState(new Set());
  const [showVerticalHighlightViewer, setShowVerticalHighlightViewer] = useState(false);
  const [highlightStartIndex, setHighlightStartIndex] = useState(0);
  const [enrichedHighlights, setEnrichedHighlights] = useState([]);
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [allHighlightsResponse, recentHighlightsResponse, creatorsResponse] = await Promise.all([
          axios.get(`${BASE_API_URL}/api/highlights/all`),
          axios.get(`${BASE_API_URL}/api/highlights/recent`),
          axios.get(`${BASE_API_URL}/api/users/creators`)
        ]);

        setHighlights(allHighlightsResponse.data);

        const recentIds = new Set(recentHighlightsResponse.data.map(h => h._id));
        setRecentHighlights(recentIds);

        const creatorsMap = creatorsResponse.data.reduce((acc, creator) => {
          acc[creator._id] = creator;
          return acc;
        }, {});
        setCreators(creatorsMap);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectHighlight = async (highlight, index) => {
    setHighlightStartIndex(index);
    if (!recentHighlights.has(highlight._id)) {
      setViewedHighlights((prev) => new Set(prev).add(highlight._id));
    }

    setIsEnriching(true);
    const enrichedData = await Promise.all(
      highlights.map(async (h) => {
        try {
          const res = await axios.get(
            `${BASE_API_URL}/api/content/${h.content._id}`
          );
          const contentDetails = res.data;

          const creatorFromMap = creators[contentDetails.user._id];

          const creatorInfo = {
            name: contentDetails.user.name,
            profileImage: creatorFromMap ? creatorFromMap.profileImage : '',
          };

          return {
            ...h,
            content: contentDetails,
            creator: creatorInfo
          };
        } catch (e) {
          console.error(`Failed to fetch content or enrich highlight ${h._id}:`, e);
          return {
            ...h,
            creator: { name: 'Error loading data', profileImage: '' }
          };
        }
      })
    );

    setEnrichedHighlights(enrichedData);
    setIsEnriching(false);
    setShowVerticalHighlightViewer(true);
  };

  if (isLoading) {
    return <Text style={styles.loadingText}>Loading highlights...</Text>;
  }

  return (
    <View>
      <Text style={styles.headerTitle}>Highlights</Text>
      {isEnriching && (
        <View style={styles.enrichingLoader}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Preparing video...</Text>
        </View>
      )}
      <SliderHighlights
        highlights={highlights}
        handleSelectHighlight={handleSelectHighlight}
        recentHighlights={recentHighlights}
        viewedHighlights={viewedHighlights}
      />
      {showVerticalHighlightViewer && enrichedHighlights.length > 0 && (
        <VerticalHighlightViewer
          highlights={enrichedHighlights}
          startIndex={highlightStartIndex}
          onClose={() => {
            setShowVerticalHighlightViewer(false);
            setEnrichedHighlights([]);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 10,
    },
    loadingText: {
        color: 'white',
        textAlign: 'center',
    },
    enrichingLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 10,
    },
});

export default HighlightsHome;
