import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { User } from '../../payload-types'
import { isAdmin } from '../../hooks/showOnlyAdmin'
import { anyone } from '../../access/anyone'

export const Roles: CollectionConfig<'roles'> = {
  slug: 'roles',

  labels: {
    singular: {
      ja: 'ロール',
      en: 'Role',
    },
    plural: {
      ja: 'ロール',
      en: 'Roles',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },

  defaultPopulate: {
    // title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['slug', 'updatedAt'],
    useAsTitle: 'label',
    hidden: ({ user }) => {
      return !isAdmin(user as unknown as User)
    },
  },
  fields: [
    {
      name: 'name',
      label: {
        ja: 'フィールド名(ENUM)',
        en: 'Value Field Name(ENUM)',
        it: 'Nome del campo di valore(ENUM)',
      },
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'text',
      label: {
        ja: '説明',
        en: 'Description',
        it: 'Descrizione',
      },
    },
    {
      name: 'label',
      label: {
        ja: '表示名',
        en: 'Label',
        it: 'Etichetta',
      },
      type: 'text',
      required: true,
      localized: true,
      unique: true,
    },

    {
      name: 'canLoginAdmin',
      label: {
        ja: 'ダッシュボードにログイン可能',
        en: 'Can Login to Dashboard',
        it: 'Può accedere al dashboard',
      },
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isAdminLevel',
      label: {
        ja: '管理者レベル',
        en: 'Admin Level',
        it: 'Livello amministratore',
      },
      type: 'checkbox',
    },

    // TODO: set access control flags for section level to dynamically set access control flags for section level

    ...slugField('name'),
  ],

  timestamps: true,
}
