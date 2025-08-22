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

  return (
    <div className="header-section">
      <h2>Header Information</h2>
      {/* Form fields will be added here */}
    </div>
  );
};

export default HeaderSection;