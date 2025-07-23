import Link from 'next/link'
import { DefaultCellComponentProps } from 'payload'

const GoToPaymentRecords = (props: DefaultCellComponentProps) => {
  return (
    <Link
      href={`/admin/collections/payment-records?where[paymentSchedule][equals]=${props.rowData.id}`}
    >
      GoToPaymentRecords
    </Link>
  )
}

export default GoToPaymentRecords
