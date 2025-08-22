import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesService from '../services/salesService';
import { validateSalesEntry } from '../../utils/validation';

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
  itemMaster: { items: [] }, // ✅ added to prevent errors
  validation: { header: {}, details: [] }, // ✅ added
  isValid: true, // ✅ added
  loading: false,
  error: null,
  lastSavedEntry: null
};

// Async thunk (only once ✅)
export const submitSalesEntry = createAsyncThunk(
  'salesEntry/submit',
  async (salesData, { rejectWithValue }) => {
    try {
      const response = await salesService.createSalesEntry(salesData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit sales entry'
      );
    }
  }
);

const salesEntrySlice = createSlice({
  name: 'salesEntry',
  initialState,
  reducers: {
    updateHeader: (state, action) => {
      const { field, value } = action.payload;
      state.header[field] = value;

      if (field !== 'ac_amt') {
        state.header.ac_amt = state.details.reduce(
          (sum, row) => sum + row.qty * row.rate,
          0
        );
      }
    },
    updateDetail: (state, action) => {
      const { index, field, value } = action.payload;
      state.details[index][field] = value;

      if (field === 'item_code') {
        const selectedItem = state.itemMaster.items.find(
          (item) => item.item_code === value
        );
        if (selectedItem) {
          state.details[index].item_name = selectedItem.item_name;
        }
      }

      state.header.ac_amt = state.details.reduce(
        (sum, row) => sum + row.qty * row.rate,
        0
      );
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
      if (state.details.length > 1) {
        state.details.splice(indexToRemove, 1);
        state.details.forEach((row, index) => {
          row.sr_no = index + 1;
        });
        state.header.ac_amt = state.details.reduce(
          (sum, row) => sum + row.qty * row.rate,
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSalesEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSalesEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSavedEntry = action.payload;
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
      })
      .addCase(submitSalesEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  updateHeader,
  updateDetail,
  addDetailRow,
  removeDetailRow,
  validateForm,
  clearValidation
} = salesEntrySlice.actions;

export default salesEntrySlice.reducer;
