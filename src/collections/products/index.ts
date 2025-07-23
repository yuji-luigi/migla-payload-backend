import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: {
      ja: '商品',
      en: 'Product',
      it: 'Prodotto',
    },
    plural: {
      ja: '商品',
      en: 'Products',
      it: 'Prodotti',
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
        ja: '商品名',
        en: 'Product Name',
        it: 'Nome Prodotto',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: {
        ja: '価格',
        en: 'Price',
        it: 'Prezzo',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: {
        ja: '説明',
        en: 'Description',
        it: 'Descrizione',
      },
    },
  ],
  timestamps: true,
}
