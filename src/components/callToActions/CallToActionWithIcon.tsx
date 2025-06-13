import React from 'react'
import styles from './CallToActionWithIcon.module.css'
import Image from 'next/image'

const CallToActionWithIcon = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}></div>
      <div>
        <h4>Call to Action</h4>
        <p>you have 0 classrooms registered</p>
      </div>
    </div>
  )
}

export default CallToActionWithIcon
