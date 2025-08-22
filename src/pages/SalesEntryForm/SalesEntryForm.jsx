import React, { useState } from "react";
import styles from "./SalesEntryForm.module.scss";

const SalesEntryForm = () => {
  const [header, setHeader] = useState({
    vr_no: "",
    vr_date: new Date().toISOString().split("T")[0],
    ac_name: "",
    ac_amt: 0,
    status: "A",
  });

  const [details, setDetails] = useState([
    { sr_no: 1, item_code: "", item_name: "", description: "", qty: 0, rate: 0 },
  ]);

  const handleHeaderChange = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  const addRow = () => {
    setDetails([
      ...details,
      {
        sr_no: details.length + 1,
        item_code: "",
        item_name: "",
        description: "",
        qty: 0,
        rate: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sales Entry</h1>

      {/* Header Section */}
      <div className={styles.card}>
        <h2>Header Section</h2>
        <input
          type="number"
          placeholder="Voucher No"
          value={header.vr_no}
          onChange={(e) => handleHeaderChange("vr_no", e.target.value)}
        />
      </div>

      {/* Detail Section */}
      <div className={styles.card}>
        <h2>Detail Section</h2>
        {details.map((row, index) => (
          <div key={index}>
            <input
              placeholder="Item Code"
              value={row.item_code}
              onChange={(e) =>
                setDetails(
                  details.map((r, i) =>
                    i === index ? { ...r, item_code: e.target.value } : r
                  )
                )
              }
            />
            <input
              type="number"
              placeholder="Qty"
              value={row.qty}
              onChange={(e) =>
                setDetails(
                  details.map((r, i) =>
                    i === index ? { ...r, qty: Number(e.target.value) } : r
                  )
                )
              }
            />
            <button onClick={() => removeRow(index)}>Remove</button>
          </div>
        ))}
        <button onClick={addRow}>+ Add Row</button>
      </div>
    </div>
  );
};

export default SalesEntryForm;
