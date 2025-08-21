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
            <input type="text" className={styles.input} value={header.vr_no} onChange={(e) => setHeader({...header, vr_no: e.target.value})}/>
            <p>Voucher Date: {header.vr_date}</p>
            <input type="date" className={styles.input} value={header.vr_date} onChange={(e) => setHeader({...header, vr_date: e.target.value})}/>
            <p>Account Name: {header.ac_name}</p>
            <input type="text" className={styles.input} value={header.ac_name} onChange={(e) => setHeader({...header, ac_name: e.target.value})}/>
            <p>Account Amount: {header.ac_amt}</p>
            <input type="number" className={styles.input} value={header.ac_amt} onChange={(e) => setHeader({...header, ac_amt: e.target.value})}/>
            <p>Status: {header.status}</p>
            <input type="text" className={styles.input} value={header.status} onChange={(e) => setHeader({...header, status: e.target.value})}/>
            

        </div>
      </div>
    );
  }