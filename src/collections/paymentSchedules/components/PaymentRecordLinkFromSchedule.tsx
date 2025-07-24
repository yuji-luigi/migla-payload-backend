'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BeforeDocumentControlsClientProps } from 'payload'
import React from 'react'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { Button } from '@payloadcms/ui'

const PaymentScheduleEditView = (props: BeforeDocumentControlsClientProps) => {
  const params = useParams()
  const { t } = useCustomTranslations()
  console.log(params)
  const id = params.segments?.at(-1)
  // const id = (params.segments as unknown as string[])?.pop()
  // get the id from url /xx/swg/gawrfa/avf/:id in server side

  return (
    <Link
      className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup bg-blue-500 text-white"
      href={`/admin/collections/payment-records?where[paymentSchedule][equals]=${id}`}
    >
      {/* <Link href={`/admin/collections/payment-records?where[paymentSchedule][equals]=${id}`}>
        {t('paymentSchedules:paymentRecordLinkText')}
        </Link> */}
      {t('paymentSchedules:paymentRecordLinkText')}
    </Link>
  )
}

export default PaymentScheduleEditView
