import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const PaymentRecords: CollectionConfig = {
  slug: 'payment-records',
  labels: {
    singular: {
      ja: '支払い記録',
      en: 'Payment Record',
      it: 'Registro Pagamento',
    },
    plural: {
      ja: '支払い記録',
      en: 'Payment Records',
      it: 'Registri Pagamento',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'payer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: {
        ja: '支払う人',
        en: 'Payer',
        it: 'Pagante',
      },
    },
    {
      name: 'studentCount',
      type: 'number',
      required: true,
      label: {
        ja: '生徒人数',
        en: 'Student Count',
        it: 'Numero Studenti',
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
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: false,
      label: {
        ja: '商品',
        en: 'Products',
        it: 'Prodotti',
      },
    },
    {
      name: 'total',
      type: 'number',
      virtual: true,
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            const tuitionFee = siblingData.tuitionFee || 0
            const materialFee = siblingData.materialFee || 0
            return tuitionFee + materialFee
          },
        ],
      },
    },
    {
      name: 'paid',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      label: {
        ja: '支払い済み',
        en: 'Paid',
        it: 'Pagato',
      },
    },
    {
      name: 'notificationStatus',
      type: 'select',
      required: true,
      defaultValue: 'idle',
      options: [
        {
          label: {
            ja: '待機中',
            en: 'Idle',
            it: 'In Attesa',
          },
          value: 'idle',
        },
        {
          label: {
            ja: '送信済み',
            en: 'Sent',
            it: 'Inviato',
          },
          value: 'sent',
        },
        {
          label: {
            ja: '確認済み',
            en: 'Seen',
            it: 'Visto',
          },
          value: 'seen',
        },
      ],
      label: {
        ja: '通知ステータス',
        en: 'Notification Status',
        it: 'Stato Notifica',
      },
    },
  ],
  timestamps: true,
}
