import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { setUser } from '../features/userSlice';  // Import setUser action
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get user from AsyncStorage
// const getUserFromStorage = async () => {
//   const user = await AsyncStorage.getItem('user');
//   return user ? JSON.parse(user) : null;
// };

const initialState = {
  user: null,
  userToken: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',

};

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    const response = await authService.register(user);
    console.log('Registration successful:', response);
    thunkAPI.dispatch(setUser(response));  // Dispatch setUser action
    await AsyncStorage.setItem('userToken', response.token);
    return response;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const response = await authService.login(user);
    console.log('Login successful:', response);
    thunkAPI.dispatch(setUser(response)); // Dispatch setUser action
    await AsyncStorage.setItem('userToken', response.token);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    return thunkAPI.rejectWithValue(error.message || 'Login failed');
  }
});


export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  await authService.logout();
  thunkAPI.dispatch(clearUser());  // Clear user state on logout
  await AsyncStorage.removeItem('userToken');
});

export const checkUserLoggedIn = createAsyncThunk('auth/checkUserLoggedIn', async (_, thunkAPI) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      thunkAPI.dispatch(setUser({ token: userToken }));
      return userToken;
    }
  } catch (error) {
    console.error('Failed to fetch user token from storage', error);
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
       .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.userToken = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
       .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.userToken = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.userToken = null;
      })
      .addCase(checkUserLoggedIn.fulfilled, (state, action) => {
        state.userToken = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
