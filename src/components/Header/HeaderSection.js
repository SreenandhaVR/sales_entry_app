import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateHeader } from "../../store/silces/salesEntrySlice";
const HeaderSection = () => {
  const dispatch = useDispatch();
  const { header } = useSelector((state) => state.salesEntry);

  const handleChange = (field, value) => {
    dispatch(updateHeader({ ...header, [field]: value }));
  };

  return (
    <div className="header-section">
      <h2>Header Information</h2>

      <label>
        Voucher No:
        <input
          value={header.vr_no}
          onChange={(e) => handleChange("vr_no", e.target.value)}
        />
      </label>

      <label>
        Date:
        <input
          type="date"
          value={header.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </label>

      <label>
        Customer:
        <input
          value={header.customer}
          onChange={(e) => handleChange("customer", e.target.value)}
        />
      </label>
    </div>
  );
};

export default HeaderSection;
