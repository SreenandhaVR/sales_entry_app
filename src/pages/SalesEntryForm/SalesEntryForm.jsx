import React, { useState } from "react";
import styles from "./home.module.scss";

export default function SalesEntryForm() {
  const [header, setHeader] = useState({
    vr_no: "001",
    vr_date: "2025-08-21",
    ac_amt: 0,
  });

  const [details, setDetails] = useState([
    { sr_no: 1, item_code: "", qty: 0, rate: 0 },
  ]);

  const updateTotal = (rows) => {
    const total = rows.reduce((sum, r) => sum + r.qty * r.rate, 0);
    setHeader((prev) => ({ ...prev, ac_amt: total }));
  };

  const handleAddRow = () => {
    const newRow = {
      sr_no: details.length + 1,
      item_code: "",
      qty: 0,
      rate: 0,
    };
    const newDetails = [...details, newRow];
    setDetails(newDetails);
    updateTotal(newDetails);
  };

  const handleRemoveRow = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
    updateTotal(newDetails);
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = field === "item_code" ? value : Number(value);
    setDetails(newDetails);
    updateTotal(newDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ header, details });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageHeader}>Sales Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Voucher No:</label>
          <input
            className={styles.input}
            type="text"
            value={header.vr_no}
            onChange={(e) =>
              setHeader({ ...header, vr_no: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label>Date:</label>
          <input
            className={styles.input}
            type="date"
            value={header.vr_date}
            onChange={(e) =>
              setHeader({ ...header, vr_date: e.target.value })
            }
          />
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Item Code</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, i) => (
              <tr key={i}>
                <td>{row.sr_no}</td>
                <td>
                  <input
                    className={styles.input}
                    value={row.item_code}
                    onChange={(e) =>
                      handleDetailChange(i, "item_code", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    value={row.qty}
                    onChange={(e) =>
                      handleDetailChange(i, "qty", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className={styles.input}
                    type="number"
                    value={row.rate}
                    onChange={(e) =>
                      handleDetailChange(i, "rate", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={() => handleRemoveRow(i)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className={styles.btn}
          onClick={handleAddRow}
        >
          + Add Row
        </button>

        <div className={styles.totalBox}>
          <p>Total Amount: {header.ac_amt}</p>
        </div>

        <button type="submit" className={styles.btn}>
          Submit
        </button>
      </form>
    </div>
  );
}
