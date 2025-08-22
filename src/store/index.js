import { configureStore } from '@reduxjs/toolkit';
import salesEntrySlice from '../store/silces/salesEntrySlice';
import itemMasterSlice from '../store/silces/itemMasterSlice';

export const store = configureStore({
  reducer: {
    salesEntry: salesEntrySlice,
    itemMaster: itemMasterSlice,
  },
});

// Remove TypeScript type aliases from JS file