'use client'
import { Button, Card } from '@payloadcms/ui'
import Link from 'next/link'
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
        <Link href={href}>
          <Button buttonStyle="icon-label" iconStyle="with-border" icon={Icon} />
        </Link>
      }
    ></Card>
  )
}

export default CardIconAction
