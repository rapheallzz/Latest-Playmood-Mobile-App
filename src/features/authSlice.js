import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { setUser, clearUser } from '../features/userSlice';  // Import setUser and clearUser actions
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    thunkAPI.dispatch(setUser(response));
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
    thunkAPI.dispatch(setUser(response));
    await AsyncStorage.setItem('userToken', response.token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  await authService.logout();
  thunkAPI.dispatch(clearUser());
  await AsyncStorage.removeItem('userToken');
});

export const checkUserLoggedIn = createAsyncThunk('auth/checkUserLoggedIn', async (_, thunkAPI) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      const user = await authService.getUser(userToken);
      thunkAPI.dispatch(setUser(user));
      return { user, token: userToken };
    }
    return null;
  } catch (error) {
    await authService.logout();
    thunkAPI.dispatch(clearUser());
    await AsyncStorage.removeItem('userToken');
    return thunkAPI.rejectWithValue('Failed to fetch user data');
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
      .addCase(checkUserLoggedIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserLoggedIn.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.userToken = action.payload.token;
        } else {
          state.user = null;
          state.userToken = null;
        }
      })
      .addCase(checkUserLoggedIn.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.userToken = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
