import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../store/slices/itemMasterSlice';
import { submitSalesEntry, validateForm } from '../store/slices/salesEntrySlice';
import HeaderSection from './Header/HeaderSection';
import DetailSection from './Detail/DetailSection';
import { Save, Printer } from 'lucide-react';
import Button from './ui/Button';

const SalesEntry = () => {
  const dispatch = useDispatch();
  const { header, details, loading, error, isValid } = useSelector(
    (state) => state.salesEntry
  );

  useEffect(() => {
    // Load item master data on component mount
    dispatch(fetchItems());
  }, [dispatch]);

  const handleSubmit = async () => {
    // 1. Validate form
    dispatch(validateForm());

    if (!isValid) {
      alert('Please fix validation errors before submitting');
      return;
    }

    // 2. Prepare submission payload
    const submissionData = {
      header_table: {
        ...header,
        vr_no: parseInt(header.vr_no)
      },
      detail_table: details.map((detail) => ({
        ...detail,
        vr_no: parseInt(header.vr_no),
        qty: parseFloat(detail.qty),
        rate: parseFloat(detail.rate)
      }))
    };

    // 3. Dispatch submit thunk
    try {
      await dispatch(submitSalesEntry(submissionData)).unwrap();
      alert('Sales entry saved successfully!');
    } catch (err) {
      alert(`Error: ${err}`);
    }
  };

  return (
    <div className="sales-entry">
      <div className="page-header">
        <div>
          <h1>Sales Entry</h1>
          <p>Create and manage sales vouchers</p>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            icon={<Save size={20} />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </Button>
          <Button variant="secondary" icon={<Printer size={20} />}>
            Print
          </Button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <HeaderSection />
      <DetailSection />
    </div>
  );
};

export default SalesEntry;
