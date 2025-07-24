import { DefaultEditView } from '@payloadcms/ui'
import Link from 'next/link'
import { DefaultCellComponentProps } from 'payload'
import { useFormState } from 'react-hook-form'

const GoToPaymentRecords = (props: DefaultCellComponentProps) => {
  const formState = useFormState()
  return (
    <>
      <Link
        href={`/admin/collections/payment-records?where[paymentSchedule][equals]=${props.rowData.id}`}
      >
        GoToPaymentRecords
      </Link>
    </>
  )
}

export default GoToPaymentRecords
