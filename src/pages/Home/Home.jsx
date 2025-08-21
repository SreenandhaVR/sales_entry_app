import React from 'react'
import styles from './Home.module.scss'
import Button from '../../components/Button/Button'
import { Plus, Trash2, Save, Printer, Calendar } from 'lucide-react';
const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h1>Sales Entry</h1>
          <p className={styles.subtitle}>
            Enter your sales data and Manage Sales Vouchers.
          </p>
          
          </div>
          <div className={styles.headerActions}>
            <Button variant="primary" icon={<Save size={20} />} >
              Save Entry
            </Button>
            <Button variant="secondary" icon={<Printer size={20} />}>
              Print
            </Button>
          </div>
        </div>
      </div>
  )
}

export default Home;