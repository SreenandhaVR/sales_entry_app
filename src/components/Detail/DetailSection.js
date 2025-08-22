import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import Button from "../ui/Button";
import DetailRow from "./DetailRow";

import {
    addDetailRow,
    updateDetail,
    removeDetailRow,
  } from "../../store/silces/salesEntrySlice";
const DetailSection = () => {
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.salesEntry);

  return (
    <div className="detail-section">
      <div className="section-header">
        <h2>Detail Information</h2>
        <Button icon={<Plus size={18} />} onClick={() => dispatch(addDetailRow())}>
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
              onUpdate={(updateDetail) =>
                dispatch(updateDetail({ index, row: updateDetail }))
              }
              onDelete={() => dispatch(removeDetailRow(index))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailSection;
