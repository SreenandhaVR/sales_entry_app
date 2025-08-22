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
    updateHeader: (state, action) => {
      const { field, value } = action.payload;
      state.header[field] = value;
      
      // Auto-calculate total if not updating amount directly
      if (field !== 'ac_amt') {
        state.header.ac_amt = state.details.reduce(
          (sum, row) => sum + (row.qty * row.rate), 0
        );
      }
    },
    updateDetail: (state, action) => {
        const { index, field, value } = action.payload;
        state.details[index][field] = value;
        
        // Auto-populate item name if item code changes
        if (field === 'item_code') {
          const selectedItem = state.itemMaster.items.find(
            item => item.item_code === value
          );
          if (selectedItem) {
            state.details[index].item_name = selectedItem.item_name;
          }
        }
        
        // Recalculate header total
        state.header.ac_amt = state.details.reduce(
          (sum, row) => sum + (row.qty * row.rate), 0
        );
      },
      
      addDetailRow: (state) => {
        const newRow = {
          sr_no: state.details.length + 1,
          item_code: '',
          item_name: '',
          description: '',
          qty: 0,
          rate: 0
        };
        state.details.push(newRow);
      },
      
      removeDetailRow: (state, action) => {
        const indexToRemove = action.payload;
        if (state.details.length > 1) {
          state.details.splice(indexToRemove, 1);
          // Re-index remaining rows
          state.details.forEach((row, index) => {
            row.sr_no = index + 1;
          });
          // Recalculate total
          state.header.ac_amt = state.details.reduce(
            (sum, row) => sum + (row.qty * row.rate), 0
          );
        }
      }
    }
  
});

export default salesEntrySlice.reducer;