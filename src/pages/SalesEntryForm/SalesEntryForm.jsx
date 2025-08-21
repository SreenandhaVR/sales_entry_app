import React from 'react'
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
        <h2>Sales Entry</h2>
      </div>
    );
  }