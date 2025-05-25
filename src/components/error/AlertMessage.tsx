import React, { ReactNode } from 'react'
import styles from './AlertMessage.module.css'

export const AlertMessage = ({
  children,
  className,
  type = 'error',
}: {
  children: ReactNode
  className?: string
  type?: 'error' | 'success' | 'warning' | 'info'
}) => {
  const color = {
    error: 'var(--color-error)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  }
  return (
    <div
      className={`flex flex-row items-center py-3 px-5  ${styles.errorText} ${className} ${color[type]}`}
    >
      <div className="w-4 h-4  rounded-full"></div>
      <div className={`flex flex-col align-start text-left`}>{children}</div>
    </div>
  )
}
