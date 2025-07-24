import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { createPaymentRecordsAfterSchedule } from './hooks/createPaymentRecordsAfterSchedule'
import PaymentScheduleEditView from './components/PaymentRecordLinkFromSchedule'

export const PaymentSchedules: CollectionConfig = {
  slug: 'payment-schedules',
  // folders: true,
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

  hooks: {
    afterChange: [createPaymentRecordsAfterSchedule],
  },
  admin: {
    useAsTitle: 'name',
    components: {
      edit: {
        beforeDocumentControls: [
          '@/collections/paymentSchedules/components/PaymentRecordLinkFromSchedule',
        ],
      },
    },
  },
  fields: [
    {
      name: 'paymentRecords',
      label: 'Payment Records',
      type: 'relationship',
      relationTo: 'payment-records',
      hasMany: true,
      // only pull records whose `paymentSchedule` field equals *this* schedule’s ID
      filterOptions: ({ id }) => ({
        paymentSchedule: { equals: id },
      }),
      admin: {
        // show it in the sidebar for quick access
        position: 'sidebar',
        // optionally disable creating here if you prefer
        // hideCreate: false,
      },
    },
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
        ja: '授業料(後から個別に変更可能)',
        en: 'Tuition Fee (can be changed individually)',
        it: 'Tassa di Iscrizione (può essere cambiata individualmente)',
      },
    },
    {
      name: 'tuitionFeeDescription',
      type: 'text',
      required: true,
      label: {
        ja: '授業料の説明(後から個別に変更可能)',
        en: 'Tuition Fee Description (can be changed individually)',
        it: 'Descrizione Tassa di Iscrizione (può essere cambiata individualmente)',
      },
    },
    {
      name: 'materialFee',
      type: 'number',
      required: false,
      label: {
        ja: '教材費(後から個別に変更可能)',
        en: 'Material Fee (can be changed individually)',
        it: 'Tassa Materiali (può essere cambiata individualmente)',
      },
    },
    {
      name: 'materialFeeDescription',
      type: 'text',
      required: false,
      label: {
        ja: '教材費の説明(後から個別に変更可能)',
        en: 'Material Fee Description (can be changed individually)',
        it: 'Descrizione Tassa Materiali (può essere cambiata individualmente)',
      },
    },
    {
      name: 'notificationTitle',
      type: 'text',
      required: true,
      label: {
        ja: 'タイトル',
        en: 'Title',
        it: 'Titolo',
      },
    },
    {
      name: 'notificationSubtitle',
      type: 'text',
      required: false,
      label: {
        ja: 'サブタイトル',
        en: 'Subtitle',
        it: 'Sottotitolo',
      },
    },
    {
      name: 'notificationBody',
      type: 'textarea',
      required: false,
      label: {
        ja: '本文',
        en: 'Body',
        it: 'Corpo',
      },
    },
    {
      name: 'notificationAlertMessage',
      type: 'text',
      required: false,
      label: {
        ja: '注意書き',
        en: 'Warning text',
        it: 'Testo di Attenzione',
      },
    },
  ],
  timestamps: true,
}
