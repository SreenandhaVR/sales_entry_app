import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchItems } from '../store/slices/itemMasterSlice';
import HeaderSection from './Header/HeaderSection';
import DetailSection from './Detail/DetailSection';
import { Save, Printer } from 'lucide-react';
import Button from './ui/Button';

const SalesEntry = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load item master data on component mount
    dispatch(fetchItems());
  }, [dispatch]);

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <div className="sales-entry">
      <div className="page-header">
        <div>
          <h1>Sales Entry</h1>
          <p>Create and manage sales vouchers</p>
        </div>
        <div className="header-actions">
          <Button variant="primary" icon={<Save size={20} />} onClick={handleSubmit}>
            Save Entry
          </Button>
          <Button variant="secondary" icon={<Printer size={20} />}>
            Print
          </Button>
        </div>
      </div>

      <HeaderSection />
      <DetailSection />
    </div>
  );
};

export default SalesEntry;