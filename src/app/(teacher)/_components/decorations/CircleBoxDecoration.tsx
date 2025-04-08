import React from 'react'
import styles from './CircleBox.module.css'

const CircleBoxDecoration = ({
  position,
}: {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}) => {
  const classNameAbove = position + 'Above'
  const classNameBelow = position + 'Below'
  return (
    <>
      <div className={styles.root}>
        <div className={`${styles.circleDecoration} ${styles[classNameAbove]}`}></div>
      </div>
      <div className={styles.root}>
        <div className={`${styles.circleDecoration} ${styles[classNameBelow]}`}></div>
      </div>
    </>
  )
}

export default CircleBoxDecoration
