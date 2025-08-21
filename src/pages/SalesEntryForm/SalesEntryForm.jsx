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
    const [details,setDetails] = useState([
        {
            sr_no:1,
            item_code:'',
            item_name:'',
            description:'',
            qty:0,
            rate:0,
        }
    ]);
    const updateTotal = (rows) => {
        const total = rows.reduce((sum, r) => sum + r.qty * r.rate, 0);
        setHeader((prev) => ({ ...prev, ac_amt: total }));
      };
      
      
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
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Item Code</th>
                        <th>Qty</th>
                        <th>Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        details.map((row,i) => (
                            <tr key={i}>
                                <td>
                                    {row.sr_no}
                                </td>
                                <td>
                                    <input className={styles.input} value={row.item_code} /></td>
        <td>
            <input className={styles.input} type="number" value={row.qty} /></td>
        <td>
            <input className={styles.input} type="number" value={row.rate} /></td>
      </tr>
    ))}
  </tbody>
</table>
<button
  type="button"
  className={styles.btn}
  onClick={() =>
    setDetails([...details, { sr_no: details.length + 1, item_code: "", qty: 0, rate: 0 }])
  }
>
  + Add Row
</button>
        </div>
        <form
  onSubmit={(e) => {
    e.preventDefault();
    console.log({ header, details });
  }}
>
  {/* form content */}
  <button type="submit" className={styles.btn}>Submit</button>
</form>


      </div>
    );
  }