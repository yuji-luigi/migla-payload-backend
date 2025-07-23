import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { calculatePaymentRecordTotal } from '../../utilities/calculatePaymentRecordTotal'

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

  hooks: {
    beforeOperation: [
      ({ operation, args }) => {
        // only on list‐ or detail‐reads from the Admin UI
        if (operation === 'read' && (!args.depth || args.depth === 0)) {
          // bump depth so that your nested "product" relationships are populated
          // args.depth = 100
        }
        return args
      },
    ],
  },
  admin: {
    useAsTitle: 'id',

    listSearchableFields: [
      'id',
      'payer.name',
      'payer.surname',
      'payer.email',
      'paymentSchedule.name',
    ],
  },

  fields: [
    {
      name: 'paymentSchedule',
      type: 'relationship',
      relationTo: 'payment-schedules',
      required: true,
      label: {
        ja: '支払いスケジュール',
        en: 'Payment Schedule',
        it: 'Programma di Pagamento',
      },
    },
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
        ja: '授業料 1人あたり',
        en: 'Tuition Fee per Student',
        it: 'Tassa di Iscrizione per Studente',
      },
    },
    {
      name: 'tuitionFeeTotalAndSingle',
      type: 'text',
      virtual: true,
      label: {
        ja: '授業料(合計)',
        en: 'Tuition Fee (Total)',
        it: 'Tassa di Iscrizione (Totale)',
      },
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            return `${siblingData.tuitionFee}€ (${siblingData.tuitionFee * siblingData.studentCount}€)`
          },
        ],
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
      name: 'purchases',
      type: 'array',

      fields: [
        {
          name: 'productAndQuantity',
          type: 'group',

          fields: [
            {
              name: 'product',
              type: 'relationship',
              maxDepth: 2,
              relationTo: 'products',
            },
            {
              name: 'quantity',
              type: 'number',
            },
            {
              name: 'price',
              type: 'number',
              virtual: true,
              admin: {
                hidden: true,
              },
              hooks: {
                afterRead: [
                  ({ siblingData }) => {
                    return siblingData.product?.price || 0
                  },
                ],
              },
            },
          ],
        },
        // {
        //   name: 'product',
        //   type: 'relationship',
        //   relationTo: 'products',
        //   required: false,
        //   label: {
        //     ja: '商品',
        //     en: 'Products',
        //     it: 'Prodotti',
        //   },
        // },
      ],
    },
    {
      name: 'total',
      type: 'number',
      virtual: true,
      label: {
        ja: '合計',
        en: 'Total',
        it: 'Totale',
      },

      admin: {
        hidden: true,
      },
      hidden: true,
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            const tuitionFee = siblingData.tuitionFee * siblingData.studentCount || 0
            const materialFee = siblingData.materialFee * siblingData.studentCount || 0
            return tuitionFee + materialFee
          },
        ],
      },
    },
    {
      name: 'totalString',
      type: 'text',
      virtual: true,
      admin: {
        hidden: true,
      },
      label: {
        ja: '合計(€)',
        en: 'Total (€)',
        it: 'Totale (€)',
      },
      hooks: {
        afterRead: [
          async ({ siblingData, originalDoc, req }) => {
            const total = await calculatePaymentRecordTotal(originalDoc, req.payload)
            return `${total}€`
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
