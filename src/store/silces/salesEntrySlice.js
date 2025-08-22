import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesService from '../services/salesService';

const initialState = {
  header: {
    vr_no: '',
    vr_date: new Date().toISOString().split('T')[0],
    ac_name: '',
    ac_amt: 0,
    status: 'A'
  },
  details: [
    {
      sr_no: 1,
      item_code: '',
      item_name: '',
      description: '',
      qty: 0,
      rate: 0
    }
  ],
  loading: false,
  error: null
};

const salesEntrySlice = createSlice({
  name: 'salesEntry',
  initialState,
  reducers: {
    // Reducers implementation
  }
});

export default salesEntrySlice.reducer;