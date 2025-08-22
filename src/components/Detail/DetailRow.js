import React from "react";
import { Trash2 } from "lucide-react";

const DetailRow = ({ row, index, onUpdate, onDelete }) => {
  const handleChange = (field, value) => {
    onUpdate({ ...row, [field]: value });
  };

  return (
    <div className="table-row">
      <div>{index + 1}</div>

      <input
        value={row.item_code}
        onChange={(e) => handleChange("item_code", e.target.value)}
        placeholder="Code"
      />

      <input
        value={row.item_name}
        onChange={(e) => handleChange("item_name", e.target.value)}
        placeholder="Name"
      />

      <input
        value={row.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Description"
      />

      <input
        type="number"
        value={row.qty}
        onChange={(e) => handleChange("qty", e.target.value)}
        placeholder="Qty"
      />

      <input
        type="number"
        value={row.rate}
        onChange={(e) => handleChange("rate", e.target.value)}
        placeholder="Rate"
      />

      <button onClick={onDelete}>
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default DetailRow;
