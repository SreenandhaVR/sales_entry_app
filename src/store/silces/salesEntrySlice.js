// src/store/slices/salesEntrySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesService from '../services/salesService';
import { validateSalesEntry } from '../../utils/validation';

// Async thunk with better error handling
export const submitSalesEntry = createAsyncThunk(
  'salesEntry/submit',
  async (salesData, { rejectWithValue }) => {
    try {
      console.log('Submitting sales data:', salesData);
      
      // Ensure vr_no is set if not already
      if (!salesData.header.vr_no || salesData.header.vr_no === '') {
        salesData.header.vr_no = Math.floor(Math.random() * 10000); // Generate a random number for demo
      }
      
      // Ensure all detail rows have the same vr_no
      salesData.details = salesData.details.map(detail => ({
        ...detail,
        vr_no: salesData.header.vr_no
      }));
      
      const response = await salesService.createSalesEntry(salesData);
      return response.data;
    } catch (error) {
      console.error('Submit error:', error);
      
      // Better error message extraction
      let errorMessage = 'Failed to submit sales entry';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch items for dropdown
export const fetchItemMaster = createAsyncThunk(
  'salesEntry/fetchItemMaster',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesService.getItemMaster();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch items');
    }
  }
);

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
  itemMaster: { items: [] },
  validation: { header: {}, details: [] },
  isValid: true,
  loading: false,
  itemsLoading: false,
  error: null,
  lastSavedEntry: null
};

const salesEntrySlice = createSlice({
  name: 'salesEntry',
  initialState,
  reducers: {
    updateHeader: (state, action) => {
      const { field, value } = action.payload;
      state.header[field] = value;
      
      // Auto-calculate total amount when other fields change
      if (field !== 'ac_amt') {
        state.header.ac_amt = state.details.reduce(
          (sum, row) => sum + (parseFloat(row.qty) || 0) * (parseFloat(row.rate) || 0),
          0
        );
      }
    },
    
    updateDetail: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.details[index]) {
        state.details[index][field] = value;

        // Auto-populate item name when item code is selected
        if (field === 'item_code') {
          const selectedItem = state.itemMaster.items.find(
            (item) => item.item_code === value
          );
          if (selectedItem) {
            state.details[index].item_name = selectedItem.item_name;
            // You can also auto-populate other fields if needed
            // state.details[index].description = selectedItem.description;
          }
        }

        // Recalculate total amount
        state.header.ac_amt = state.details.reduce(
          (sum, row) => sum + (parseFloat(row.qty) || 0) * (parseFloat(row.rate) || 0),
          0
        );
      }
    },
    
    addDetailRow: (state) => {
      state.details.push({
        sr_no: state.details.length + 1,
        item_code: '',
        item_name: '',
        description: '',
        qty: 0,
        rate: 0
      });
    },
    
    removeDetailRow: (state, action) => {
      const indexToRemove = action.payload;
      if (state.details.length > 1 && indexToRemove < state.details.length) {
        state.details.splice(indexToRemove, 1);
        // Reorder sr_no
        state.details.forEach((row, index) => {
          row.sr_no = index + 1;
        });
        // Recalculate total
        state.header.ac_amt = state.details.reduce(
          (sum, row) => sum + (parseFloat(row.qty) || 0) * (parseFloat(row.rate) || 0),
          0
        );
      }
    },
    
    validateForm: (state) => {
      const validation = validateSalesEntry({
        header: state.header,
        details: state.details
      });
      state.validation = validation;
      state.isValid =
        Object.keys(validation.header).length === 0 &&
        validation.details.every((d) => Object.keys(d).length === 0);
    },
    
    clearValidation: (state) => {
      state.validation = { header: {}, details: [] };
      state.isValid = true;
    },
    
    resetForm: (state) => {
      state.header = {
        vr_no: '',
        vr_date: new Date().toISOString().split('T')[0],
        ac_name: '',
        ac_amt: 0,
        status: 'A'
      };
      state.details = [
        {
          sr_no: 1,
          item_code: '',
          item_name: '',
          description: '',
          qty: 0,
          rate: 0
        }
      ];
      state.validation = { header: {}, details: [] };
      state.isValid = true;
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Handle sales entry submission
      .addCase(submitSalesEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSalesEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSavedEntry = action.payload;
        state.error = null;
        // Don't auto-reset form - let user decide
        // You can uncomment this if you want auto-reset:
        // salesEntrySlice.caseReducers.resetForm(state);
      })
      .addCase(submitSalesEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit sales entry';
      })
      
      // Handle item master fetch
      .addCase(fetchItemMaster.pending, (state) => {
        state.itemsLoading = true;
      })
      .addCase(fetchItemMaster.fulfilled, (state, action) => {
        state.itemsLoading = false;
        state.itemMaster.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchItemMaster.rejected, (state, action) => {
        state.itemsLoading = false;
        console.error('Failed to fetch items:', action.payload);
      });
  }
});

export const {
  updateHeader,
  updateDetail,
  addDetailRow,
  removeDetailRow,
  validateForm,
  clearValidation,
  resetForm,
  clearError
} = salesEntrySlice.actions;

export default salesEntrySlice.reducer;