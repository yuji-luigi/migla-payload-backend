import React, { ReactNode } from 'react'
import styles from './AlertMessage.module.css'

export const AlertMessage = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`flex flex-row items-center py-3 px-5  ${styles.errorText} ${className}`}>
      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
      <div className={`flex flex-col align-start text-left`}>{children}</div>
    </div>
  )
}
