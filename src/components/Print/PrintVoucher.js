import React from 'react';
import styles from './PrintVoucher.module.scss';

const PrintVoucher = ({ header, details, onClose }) => {
  const validDetails = details.filter(row => row.item_code);
  const total = validDetails.reduce((sum, row) => sum + (row.qty * row.rate), 0);

  return (
    <div className={styles.printModal}>
      <div className={styles.printButtons}>
        <button onClick={() => window.print()}>Print</button>
        <button onClick={onClose}>Close</button>
      </div>
      
      <div className={styles.printContent}>
        <div className={styles.header}>
          <h1>SALES VOUCHER</h1>
        </div>
        
        <div className={styles.info}>
          <div>
            <div><strong>Voucher No:</strong> {header.vr_no}</div>
            <div><strong>Date:</strong> {new Date(header.vr_date).toLocaleDateString()}</div>
          </div>
          <div>
            <div><strong>Account:</strong> {header.ac_name}</div>
            <div><strong>Status:</strong> {header.status === 'A' ? 'Active' : 'Inactive'}</div>
          </div>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {validDetails.map((row, index) => (
              <tr key={index}>
                <td className={styles.center}>{index + 1}</td>
                <td>{row.item_code}</td>
                <td>{row.item_name}</td>
                <td>{row.description}</td>
                <td className={styles.right}>{row.qty}</td>
                <td className={styles.right}>₹{row.rate}</td>
                <td className={styles.right}>₹{(row.qty * row.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className={styles.total}>
          Total Amount: ₹{total.toFixed(2)}
        </div>
        
        <div className={styles.signature}>
          <div></div>
          <div className={styles.signatureBox}>
            <div className={styles.line}>_____________________</div>
            <div>Authorized Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintVoucher;