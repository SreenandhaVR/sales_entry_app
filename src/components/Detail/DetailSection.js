import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

const DetailSection = () => {
  const dispatch = useDispatch();
  const { details } = useSelector(state => state.salesEntry);

  return (
    <div className="detail-section">
      <div className="section-header">
        <h2>Detail Information</h2>
        <Button icon={<Plus size={18} />} onClick={addRow}>
          Add Row
        </Button>
      </div>
      {/* Table will be added here */}
    </div>
  );
};

export default DetailSection;