import React from 'react'
import styles from './Home.module.scss'

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h1>Sales Entry</h1>
        </div>
      </div>
    </div>
  )
}

export default Home;