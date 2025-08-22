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
    // Handle async actions
  }
});

export default itemMasterSlice.reducer;