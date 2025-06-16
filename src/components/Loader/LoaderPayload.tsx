import React from 'react'
import styles from './LoaderPayload.module.css'

export const LoaderPayload = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingBars}>
        <div className="loading-overlay__bar"></div>
        <div className="loading-overlay__bar"></div>
        <div className="loading-overlay__bar"></div>
        <div className="loading-overlay__bar"></div>
        <div className="loading-overlay__bar"></div>
      </div>
      <span className="">ローディング中</span>
    </div>
  )
}
