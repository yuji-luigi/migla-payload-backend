import { APIError, type CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { User } from '../../payload-types'
import { isAdmin, isSuperAdmin } from '../../hooks/showOnlyAdmin'
import { anyone } from '../../access/anyone'

export const Roles: CollectionConfig<'roles'> = {
  slug: 'roles',

  labels: {
    singular: {
      ja: 'ロール',
      en: 'Role',
      it: 'Ruolo',
    },
    plural: {
      ja: 'ロール',
      en: 'Roles',
      it: 'Ruoli',
    },
  },
  access: {
    create: ({ req: { user, data } }) => {
      if (user?.currentRole?.isSuperAdmin) {
        return true
      }
      if (data?.isSuperAdmin) {
        throw new APIError('You are not allowed to create this role', 403, null, true)
      }
      return isAdmin(user)
    },
    delete: ({ req: { user, data } }) => {
      if (data?.isSuperAdmin) {
        throw new APIError('You are not allowed to delete this role', 403, null, true)
      }
      return isAdmin(user)
    },
    read: anyone,
    update: ({ req: { user, data } }) => {
      if (user?.currentRole?.isSuperAdmin) {
        return true
      }
      if (data?.isSuperAdmin) {
        throw new APIError('You are not allowed to update this role', 403, null, true)
      }
      return isAdmin(user)
    },
  },

  defaultPopulate: {
    // title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['slug', 'updatedAt'],
    useAsTitle: 'label',
    baseListFilter: ({ req }) => {
      const user = req.user
      if (user?.currentRole?.isSuperAdmin) {
        return null
      }
      return {
        or: [
          {
            isSuperAdmin: {
              equals: false,
            },
          },
          {
            isSuperAdmin: {
              exists: false,
            },
          },
        ],
      }
    },
    hidden: ({ user }) => {
      return !isAdmin(user) && !isSuperAdmin(user)
    },
  },
  hooks: {
    beforeChange: [
      ({ data, req: { user, context } }) => {
        if (context.isSeed) return data
        if (data.isSuperAdmin && !user?.currentRole?.isSuperAdmin) {
          data.isSuperAdmin = false
        }
        // if (data.isAdminLevel && isAdmin(user)) {
        //   data.isAdminLevel = false
        // }
        return data
      },
    ],
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
      name: 'isSuperAdmin',
      label: {
        ja: 'スーパー管理者',
        en: 'Super Admin',
        it: 'Amministratore superiore',
      },
      admin: {
        hidden: true,
      },
      type: 'checkbox',
    },
    {
      name: 'isAdmin',
      label: {
        ja: '管理者',
        en: 'Admin',
        it: 'Amministratore',
      },
      type: 'checkbox',
    },
    {
      name: 'isTeacher',
      label: {
        ja: '先生',
        en: 'Teacher',
        it: 'Docente',
      },
      type: 'checkbox',
    },
    {
      name: 'isParent',
      label: {
        ja: '保護者',
        en: 'Parent',
        it: 'Genitore',
      },
      type: 'checkbox',
    },
    {
      name: 'isOperationsCommitteeMember',
      label: {
        ja: '運営委員会メンバー',
        en: 'Operations Committee Member',
        it: 'Membro del comitato di gestione',
      },
      type: 'checkbox',
    },
    {
      name: 'canWriteReports',
      hidden: true,
      label: {
        ja: 'レポートを作成できる',
        en: 'Can write reports',
        it: 'Può scrivere rapporti',
      },
      type: 'checkbox',
    },
    {
      name: 'canWriteHomeworks',
      hidden: true,
      label: {
        ja: '宿題を作成できる',
        en: 'Can write homeworks',
        it: 'Può scrivere compiti',
      },
      type: 'checkbox',
    },
    {
      name: 'canWritePages',
      hidden: true,
      label: {
        ja: 'ページを作成できる',
        en: 'Can write pages',
        it: 'Può scrivere pagine',
      },
      type: 'checkbox',
    },

    {
      name: 'canWriteParents',
      hidden: true,
      label: {
        ja: '保護者を作成できる',
        en: 'Can write parents',
        it: 'Può scrivere genitori',
      },
      type: 'checkbox',
    },
    {
      name: 'canWriteStudents',
      hidden: true,
      label: {
        ja: '生徒を作成できる',
        en: 'Can write students',
        it: 'Può scrivere studenti',
      },
      type: 'checkbox',
    },
    {
      name: 'canWriteNotifications',
      hidden: true,
      label: {
        ja: '通知を作成できる',
        en: 'Can write notifications',
        it: 'Può scrivere notifiche',
      },
      type: 'checkbox',
    },

    // TODO: set access control flags for section level to dynamically set access control flags for section level

    ...slugField('name', { slugOverrides: { required: true } }),
  ],

  timestamps: true,
}
