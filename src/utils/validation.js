export const validateHeader = (header) => {
    const errors = {};
    
    if (!header.vr_no || header.vr_no <= 0) {
      errors.vr_no = 'Voucher number is required and must be positive';
    }
    
    if (!header.vr_date) {
      errors.vr_date = 'Voucher date is required';
    }
    
    if (!header.ac_name || header.ac_name.trim().length === 0) {
      errors.ac_name = 'Account name is required';
    }
    
    if (header.ac_name && header.ac_name.length > 200) {
      errors.ac_name = 'Account name cannot exceed 200 characters';
    }
    
    return errors;
  };
  
  export const validateDetail = (details) => {
    const errors = [];
    
    details.forEach((row, index) => {
      const rowErrors = {};
      
      if (!row.item_code) {
        rowErrors.item_code = 'Item code is required';
      }
      
      if (!row.qty || row.qty <= 0) {
        rowErrors.qty = 'Quantity must be greater than 0';
      }
      
      if (!row.rate || row.rate <= 0) {
        rowErrors.rate = 'Rate must be greater than 0';
      }
      
      if (row.description && row.description.length > 3000) {
        rowErrors.description = 'Description cannot exceed 3000 characters';
      }
      
      errors[index] = rowErrors;
    });
    
    return errors;
  };
  
  export const validateSalesEntry = (salesEntry) => {
    return {
      header: validateHeader(salesEntry.header),
      details: validateDetail(salesEntry.details)
    };
  };