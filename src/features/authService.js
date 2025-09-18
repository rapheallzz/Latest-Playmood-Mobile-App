import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://playmoodserver-stg-0fb54b955e6b.herokuapp.com/api/users/';

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    console.log(response);

    if (response.data) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data) {
      await AsyncStorage.setItem('user', JSON.stringify({ ...response.data, role: response.data.role }));
    }

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Logout user
const logout = async () => {
  await AsyncStorage.removeItem('user');
};

// Get user
const getUser = async (token) => {
  try {
    const response = await axios.get(API_URL + 'me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get user failed:', error);
    throw error;
  }
};

const authService = {
  register,
  logout,
  login,
  getUser,
};

export default authService;
