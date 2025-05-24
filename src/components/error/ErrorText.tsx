import React, { ReactNode } from 'react'
import styles from './ErrorText.module.css'

export const ErrorText = ({ children }: { children: ReactNode }) => {
  return <div className={styles.errorText}>{children}</div>
}
