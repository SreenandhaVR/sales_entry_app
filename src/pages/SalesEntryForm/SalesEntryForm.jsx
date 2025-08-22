import React, { useState } from "react";
import styles from "../styles/SalesEntryForm.module.scss";
import { saveVoucher } from "../api/salesAPI";

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

  const calculateTotal = () =>
    details.reduce((sum, r) => sum + r.qty * r.rate, 0);

  const handleSubmit = async () => {
    const data = {
      header_table: { ...header, ac_amt: calculateTotal() },
      detail_table: details,
    };
    try {
      await saveVoucher(data);
      alert("Voucher saved successfully!");
    } catch (err) {
      alert("Failed to save");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sales Entry</h1>

      <div className={styles.card}>
        <h2>Header Section</h2>
        <input
          type="text"
          placeholder="Account Name"
          value={header.ac_name}
          onChange={(e) => handleHeaderChange("ac_name", e.target.value)}
        />
      </div>

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
          </div>
        ))}
        <p>Total: ₹{calculateTotal()}</p>
        <button onClick={handleSubmit}>Save Voucher</button>
      </div>
    </div>
  );
};

export default SalesEntryForm;
