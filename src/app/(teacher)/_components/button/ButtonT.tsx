import React from 'react'
import styles from './ButtonT.module.css'

export const ButtonT = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <button className={styles.button + ' ' + className}>{children}</button>
}
