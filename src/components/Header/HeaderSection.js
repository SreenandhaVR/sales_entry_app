import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Calendar } from 'lucide-react';

const HeaderSection = () => {
  const dispatch = useDispatch();
  const { header } = useSelector(state => state.salesEntry);

  const statusOptions = [
    { value: 'A', label: 'Active' },
    { value: 'I', label: 'Inactive' }
  ];
  const handleHeaderChange = (field, value) => {
    dispatch(updateHeader({ field, value }));
  };

  return (
    <div className="header-section">
      <h2>Header Information</h2>
      <div className="header-grid">
      <Input
        label="Voucher No."
        type="number"
        value={header.vr_no}
        onChange={(e) => handleHeaderChange('vr_no', e.target.value)}
        required
      />
      {/* Add other fields */}
    </div>
  </div>
);
};

export default HeaderSection;