import { configureStore } from '@reduxjs/toolkit';
import salesEntrySlice from './slices/salesEntrySlice';
import itemMasterSlice from './slices/itemMasterSlice';

export const store = configureStore({
  reducer: {
    salesEntry: salesEntrySlice,
    itemMaster: itemMasterSlice,
  },
});

// Remove TypeScript type aliases from JS file