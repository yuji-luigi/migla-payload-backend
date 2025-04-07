import React from 'react'
import styles from './CircleBox.module.css'

const CircleBoxTopLeft = () => {
  return (
    <div className={styles.container}>
      <div className={styles.circleBoxLeft}></div>
      <div className={styles.circleBoxTopRight}></div>
    </div>
  )
}

export default CircleBoxTopLeft
