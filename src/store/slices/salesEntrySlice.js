import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { salesService, itemService } from '../services/allAPI';
export const getNextVrNo = createAsyncThunk(
  'salesEntry/getNextVrNo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesService.getHeaders();
      const headers = response.data || [];
      

      const timestamp = Date.now().toString().slice(-4);
      const random = Math.floor(Math.random() * 99).toString().padStart(2, '0');
      return parseInt(timestamp + random);
    } catch (error) {
      console.error('Get next VR No error:', error);
      return rejectWithValue('Failed to get next voucher number');
    }
  }
);


export const submitSalesEntry = createAsyncThunk(
  'salesEntry/submit',
  async (salesData, { rejectWithValue }) => {
    try {
      console.log('Submitting sales data:', salesData);
      

      if (!salesData.header.vr_no || salesData.header.vr_no === '') {
        return rejectWithValue('Voucher number is required');
      }
      

      const vrNo = parseInt(salesData.header.vr_no) || Date.now().toString().slice(-6);
      
      const submissionData = {
        header_table: {
          vr_no: vrNo,
          vr_date: new Date(salesData.header.vr_date).toISOString(),
          ac_name: salesData.header.ac_name.trim().toUpperCase(),
          ac_amt: parseFloat(salesData.header.ac_amt) || 0,
          status: salesData.header.status,
        },
        detail_table: salesData.details
          .filter(detail => detail.item_code)
          .map((detail, index) => ({
            vr_no: vrNo,
            sr_no: index + 1,
            item_code: detail.item_code.toString().trim(),
            item_name: detail.item_name || '',
            description: detail.description?.trim() || 'N/A',
            qty: parseFloat(detail.qty) || 0,
            rate: parseFloat(detail.rate) || 0,
          })),
      };
      
      console.log('Final submission data:', JSON.stringify(submissionData, null, 2));
      
      // Use the combined endpoint for better data consistency
      const response = await salesService.createSalesEntry(submissionData);
      
      // Return the complete saved entry for printing
      return {
        header: submissionData.header_table,
        details: submissionData.detail_table,
        response: response.data
      };
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response);
      

      let errorMessage = 'Failed to submit sales entry';
      
      if (error.response?.data) {
        console.log('Server error details:', error.response.data);
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || error.response.data.error || 'Server error';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchItemMaster = createAsyncThunk(
  'salesEntry/fetchItemMaster',
  async (_, { rejectWithValue }) => {
    try {
      const response = await itemService.getAllItems();
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
  itemMaster: [],
  loading: false,
  itemsLoading: false,
  vrNoLoading: false,
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
          const selectedItem = state.itemMaster.find(
            (item) => item.item_code === value
          );
          if (selectedItem) {
            state.details[index].item_name = selectedItem.item_name;
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
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Handle get next VR No
      .addCase(getNextVrNo.pending, (state) => {
        state.vrNoLoading = true;
      })
      .addCase(getNextVrNo.fulfilled, (state, action) => {
        state.vrNoLoading = false;
        state.header.vr_no = action.payload.toString();
      })
      .addCase(getNextVrNo.rejected, (state, action) => {
        state.vrNoLoading = false;
        state.error = action.payload || 'Failed to get next voucher number';
      })
      
      // Handle sales entry submission
      .addCase(submitSalesEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSalesEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSavedEntry = action.payload;
        state.error = null;
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
        state.itemMaster = Array.isArray(action.payload) ? action.payload : [];
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
  resetForm,
  clearError
} = salesEntrySlice.actions;

export default salesEntrySlice.reducer;