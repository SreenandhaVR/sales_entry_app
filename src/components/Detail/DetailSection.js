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
    
    <div className="table-container">
      <div className="table-header">
        <div>Sr. No.</div>
        <div>Item Code</div>
        <div>Item Name</div>
        <div>Description</div>
        <div>Quantity</div>
        <div>Rate</div>
        <div>Action</div>
      </div>
      
      <div className="table-body">
        {details.map((row, index) => (
          <DetailRow 
            key={index} 
            row={row} 
            index={index}
            onUpdate={handleDetailChange}
            onDelete={removeRow}
          />
        ))}
      </div>
    </div>
  </div>
);
};

export default DetailSection;