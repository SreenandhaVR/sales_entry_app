import React, {useState} from 'react'
import styles from './home.module.scss'

export default function SalesEntryForm() {
    const [header,setHeader] = useState({
        vr_no: '',
        vr_date: '',
        ac_name: '',
        ac_amt: '',
        status: '',
    });
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Sales Entry Form</h1>
        <div className={styles.headerBox}>
            <p>Voucher No: {header.vr_no}</p>
            <p>Voucher Date: {header.vr_date}</p>
            <p>Account Name: {header.ac_name}</p>
            <p>Account Amount: {header.ac_amt}</p>
            <p>Status: {header.status}</p>

        </div>
      </div>
    );
  }