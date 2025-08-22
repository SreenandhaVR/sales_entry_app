import React,{useState} from "react";
import styles from "./SalesEntryForm.module.scss";


const SalesEntryForm = () => {
  const [header, setHeader] = useState({
    vr_no: "",
    vr_date: new Date().toISOString().split("T")[0],
    ac_name: "",
    ac_amt: 0,
    status: "A",
  });

  const handleHeaderChange = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
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
        <input
          type="date"
          value={header.vr_date}
          onChange={(e) => handleHeaderChange("vr_date", e.target.value)}
        />
        <input
          type="text"
          placeholder="Account Name"
          value={header.ac_name}
          onChange={(e) => handleHeaderChange("ac_name", e.target.value)}
        />
        <select
          value={header.status}
          onChange={(e) => handleHeaderChange("status", e.target.value)}
        >
          <option value="A">Active</option>
          <option value="I">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default SalesEntryForm;
