import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import itemService from '../services/itemService';

export const fetchItems = createAsyncThunk(
  'itemMaster/fetchItems',
  async () => {
    const response = await itemService.getAllItems();
    return response.data;
  }
);

const itemMasterSlice = createSlice({
  name: 'itemMaster',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load items';
      });
  }
});

export default itemMasterSlice.reducer;