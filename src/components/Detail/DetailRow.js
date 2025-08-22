import React from 'react';
import { useSelector } from 'react-redux';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Trash2 } from 'lucide-react';

const DetailRow = ({ row, index, onUpdate, onDelete }) => {
  const { items } = useSelector(state => state.itemMaster);
  
  const itemOptions = items.map(item => ({
    value: item.item_code,
    label: item.item_code
  }));

  return (
    <div className="table-row">
      <div className="sr-badge">{row.sr_no}</div>
      
      <Select
        options={itemOptions}
        value={row.item_code}
        onChange={(e) => onUpdate(index, 'item_code', e.target.value)}
        placeholder="Select Item"
      />
      
      <Input
        value={row.item_name}
        readOnly
        placeholder="Auto-populated"
      />
      
      {/* Add other fields */}
      
      <button
        onClick={() => onDelete(index)}
        className="delete-button"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default DetailRow;