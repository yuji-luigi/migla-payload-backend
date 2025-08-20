'use client'
import { Button, usePayloadAPI } from '@payloadcms/ui'
import { BeforeDocumentControlsServerProps } from 'payload'
import { http } from '../../../../lib/fetch/http'
import { I18nTFunc } from '../../../../types/my_types/i18n_types'
import { useParams } from 'next/navigation'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import { PaymentSchedule } from '../../../../payload-types'

const SendReminderPaymentButton = () => {
  const params = useParams()
  const { t } = useCustomTranslations()
  const id = params?.segments?.at(-1)

  const [result, setData] = usePayloadAPI(`/api/payment-schedules/${id}`)

  const { data } = result
  if (new Date(data.notificationScheduledAt).getTime() > new Date().getTime()) {
    return null
  }
  return (
    <Button
      onClick={async () => {
        // call api
        http.post(`/api/payment-schedules/send-payment-reminder/${id}`)
      }}
      className="bg-primary"
    >
      {t('paymentSchedules:sendPaymentReminder')}
    </Button>
  )
}

export default SendReminderPaymentButton
