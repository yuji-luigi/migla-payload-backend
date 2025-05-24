import React, { ReactNode } from 'react'
import styles from './ErrorText.module.css'

export const ErrorText = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`
   
    py-3 px-5
    ${styles.errorText}
    `}
    >
      {children}
    </div>
  )
}
