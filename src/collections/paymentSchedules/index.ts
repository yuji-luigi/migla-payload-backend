import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const PaymentSchedules: CollectionConfig = {
  slug: 'payment-schedules',
  labels: {
    singular: {
      ja: '支払い表',
      en: 'Payment Schedule',
      it: 'Programma di Pagamento',
    },
    plural: {
      ja: '支払い表',
      en: 'Payment Schedules',
      it: 'Programmi di Pagamento',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        ja: 'スケジュール名',
        en: 'Schedule Name',
        it: 'Nome Programma',
      },
    },
    {
      name: 'paymentDue',
      type: 'date',
      required: true,
      label: {
        ja: '支払い期限',
        en: 'Payment Due Date',
        it: 'Data Scadenza Pagamento',
      },
    },
    {
      name: 'notificationScheduledAt',
      type: 'date',
      required: true,
      label: {
        ja: '通知予定日時',
        en: 'Notification Scheduled At',
        it: 'Notifica Programmata Per',
      },
    },
    {
      name: 'tuitionFee',
      type: 'number',
      required: true,
      label: {
        ja: '授業料',
        en: 'Tuition Fee',
        it: 'Tassa di Iscrizione',
      },
    },
    {
      name: 'tuitionFeeDescription',
      type: 'text',
      required: true,
      label: {
        ja: '授業料の説明',
        en: 'Tuition Fee Description',
        it: 'Descrizione Tassa di Iscrizione',
      },
    },
    {
      name: 'materialFee',
      type: 'number',
      required: false,
      label: {
        ja: '教材費',
        en: 'Material Fee',
        it: 'Tassa Materiali',
      },
    },
    {
      name: 'materialFeeDescription',
      type: 'text',
      required: false,
      label: {
        ja: '教材費の説明',
        en: 'Material Fee Description',
        it: 'Descrizione Tassa Materiali',
      },
    },
    {
      name: 'notificationTitle',
      type: 'text',
      required: true,
      label: {
        ja: '通知タイトル',
        en: 'Notification Title',
        it: 'Titolo Notifica',
      },
    },
    {
      name: 'notificationSubtitle',
      type: 'text',
      required: false,
      label: {
        ja: '通知サブタイトル',
        en: 'Notification Subtitle',
        it: 'Sottotitolo Notifica',
      },
    },
    {
      name: 'notificationBody',
      type: 'textarea',
      required: false,
      label: {
        ja: '通知本文',
        en: 'Notification Body',
        it: 'Corpo Notifica',
      },
    },
    {
      name: 'notificationAlertMessage',
      type: 'text',
      required: false,
      label: {
        ja: '通知アラートメッセージ',
        en: 'Notification Alert Message',
        it: 'Messaggio di Allerta Notifica',
      },
    },
  ],
  timestamps: true,
}
