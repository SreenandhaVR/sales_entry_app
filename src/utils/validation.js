// Validate header
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

  // ✅ Auto-format account name
  if (header.ac_name) {
    header.ac_name = header.ac_name.trim().toUpperCase();
  }

  // ✅ Cross-check ac_amt with details
  if (details.length > 0) {
    const total = details.reduce((sum, d) => sum + (d.qty * d.rate), 0);
    if (header.ac_amt !== total) {
      errors.ac_amt = `Header amount (${header.ac_amt}) does not match details total (${total})`;
    }
  }

  return errors;
};

// Validate detail rows
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

    // ✅ Auto-correct: force uppercase codes/names
    if (row.item_code) {
      row.item_code = row.item_code.trim().toUpperCase();
    }
    if (row.item_name) {
      row.item_name = row.item_name.trim().toUpperCase();
    }

    errors[index] = rowErrors;
  });

  return errors;
};

// Master validation wrapper
export const validateSalesEntry = (salesEntry) => {
  return {
    header: validateHeader(salesEntry.header, salesEntry.details),
    details: validateDetail(salesEntry.details),
  };
};
