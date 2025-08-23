import { configureStore } from '@reduxjs/toolkit';
import salesEntryReducer from './slices/salesEntrySlice';

export const store = configureStore({
  reducer: {
    salesEntry: salesEntryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;