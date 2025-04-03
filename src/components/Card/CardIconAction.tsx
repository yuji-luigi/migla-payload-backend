'use client'
import { Button, Card } from '@payloadcms/ui'
import React, { ReactNode } from 'react'

const CardIconAction = ({
  Icon,
  title,
  href,
}: {
  Icon: ReactNode
  title: string
  href: string
}) => {
  return (
    <Card
      title={title}
      href={href}
      actions={
        <Button el="a" url={href} buttonStyle="icon-label" iconStyle="with-border" icon={Icon} />
      }
    ></Card>
  )
}

export default CardIconAction
