export const validateVoucherNumber = (vr_no) => {
  if (!vr_no || vr_no === '') {
    return 'Please enter a valid Voucher Number.';
  }
  if (isNaN(parseInt(vr_no))) {
    return 'Voucher number must be a valid number.';
  }
  return null;
};

export const validateVoucherDate = (vr_date) => {
  if (!vr_date) {
    return 'Voucher Date is required.';
  }
  return null;
};

export const validateAccountName = (ac_name) => {
  if (!ac_name || !ac_name.trim()) {
    return 'Account Name is required.';
  }
  if (ac_name.length > 200) {
    return 'Account name cannot exceed 200 characters.';
  }
  return null;
};

export const validateItemDetails = (details) => {
  const validDetails = details.filter(detail => detail.item_code);
  
  if (validDetails.length === 0) {
    return 'At least one item must be selected.';
  }

  for (const [index, detail] of validDetails.entries()) {
    if (!detail.qty || parseFloat(detail.qty) <= 0) {
      return `Quantity must be greater than 0 for row ${index + 1}.`;
    }
    
    if (!detail.rate || parseFloat(detail.rate) <= 0) {
      return `Rate must be greater than 0 for row ${index + 1}.`;
    }

    if (detail.description && detail.description.length > 3000) {
      return `Description cannot exceed 3000 characters for row ${index + 1}.`;
    }
  }
  
  return null;
};

export const validateCompleteForm = (header, details) => {
  const vrNoError = validateVoucherNumber(header.vr_no);
  if (vrNoError) return vrNoError;

  const vrDateError = validateVoucherDate(header.vr_date);
  if (vrDateError) return vrDateError;

  const acNameError = validateAccountName(header.ac_name);
  if (acNameError) return acNameError;

  const detailsError = validateItemDetails(details);
  if (detailsError) return detailsError;

  return null;
};

export const validateHeader = (header, details = []) => {
  const errors = {};

  if (!header.vr_no || header.vr_no <= 0) {
    errors.vr_no = "Voucher number is required and must be positive";
  }

  if (!header.vr_date) {
    errors.vr_date = "Voucher date is required";
  }

  if (!header.ac_name || header.ac_name.trim().length === 0) {
    errors.ac_name = "Account name is required";
  }

  if (header.ac_name && header.ac_name.length > 200) {
    errors.ac_name = "Account name cannot exceed 200 characters";
  }

  if (details.length > 0) {
    const total = details.reduce((sum, d) => sum + (d.qty * d.rate), 0);
    if (header.ac_amt !== total) {
      errors.ac_amt = `Header amount (${header.ac_amt}) does not match details total (${total})`;
    }
  }

  return errors;
};

export const validateDetail = (details) => {
  const errors = [];

  details.forEach((row, index) => {
    const rowErrors = {};

    if (!row.item_code) {
      rowErrors.item_code = "Item code is required";
    }

    if (!row.qty || row.qty <= 0) {
      rowErrors.qty = "Quantity must be greater than 0";
    }

    if (!row.rate || row.rate <= 0) {
      rowErrors.rate = "Rate must be greater than 0";
    }

    if (row.description && row.description.length > 3000) {
      rowErrors.description = "Description cannot exceed 3000 characters";
    }

    errors[index] = rowErrors;
  });

  return errors;
};

export const validateSalesEntry = (salesEntry) => {
  return {
    header: validateHeader(salesEntry.header, salesEntry.details),
    details: validateDetail(salesEntry.details),
  };
};