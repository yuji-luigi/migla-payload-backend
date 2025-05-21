import React, { ReactNode } from 'react'

export const TailWindScope = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`tailwind-scope `}>
      <div className={className}>{children}</div>
    </div>
  )
}
