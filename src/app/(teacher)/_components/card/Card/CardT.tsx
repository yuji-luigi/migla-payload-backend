import React from 'react'
import styles from './CardT.module.css'

export const CardT = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={styles.card + ' ' + className}>{children}</div>
}
