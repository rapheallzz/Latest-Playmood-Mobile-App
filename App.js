import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './store';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import SplashScreen from './src/screens/SplashScreen';
import VideoScreen from './src/screens/VideoScreen';
import CreatorChannel from './src/screens/ChannelScreen';
import DonationScreen from './src/screens/DonationScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import AdminScreen from './src/screens/AdminScreen';
import ApplyAsCreatorScreen from './src/screens/ApplyAsCreatorScreen';
import PostVideoForReviewScreen from './src/screens/PostVideoForReviewScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegistrationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VideoScreen" component={VideoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreatorPage" component={CreatorChannel} options={{ headerShown: false }} />
            <Stack.Screen name="Donation" component={DonationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Activities" component={ActivitiesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminPage" component={AdminScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ApplyAsCreator" component={ApplyAsCreatorScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PostVideoForReview" component={PostVideoForReviewScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
