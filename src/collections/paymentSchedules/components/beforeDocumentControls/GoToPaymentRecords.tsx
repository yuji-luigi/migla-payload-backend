import { DefaultEditView, useParams } from '@payloadcms/ui'
import Link from 'next/link'
import { DefaultCellComponentProps } from 'payload'
import { useFormState } from 'react-hook-form'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'

const GoToPaymentRecords = () => {
  const params = useParams()
  const { t } = useCustomTranslations()
  const id = params.segments?.at(-1)

  return (
    <>
      <Link
        className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup bg-blue-500 text-white"
        href={`/admin/collections/payment-records?where[paymentSchedule][equals]=${id}`}
      >
        {/* <Link href={`/admin/collections/payment-records?where[paymentSchedule][equals]=${id}`}>
        {t('paymentSchedules:paymentRecordLinkText')}
        </Link> */}
        {t('paymentSchedules:paymentRecordLinkText')}
      </Link>
    </>
  )
}

export default GoToPaymentRecords
