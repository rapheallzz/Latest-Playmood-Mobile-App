// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './src/features/authSlice';
import userReducer from './src/features/userSlice';
import contentReducer from './src/features/contentSlice';
import uploadReducer from './src/features/uploadSlice';
import scheduleReducer from './src/features/scheduleSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, 
    content: contentReducer,
    upload: uploadReducer,
    schedule: scheduleReducer,
  },
});
