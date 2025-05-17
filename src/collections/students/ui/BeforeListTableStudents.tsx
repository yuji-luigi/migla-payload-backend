'use client'

import React from 'react'
import styles from './DescriptionStudents.module.css'
import { Payload } from 'payload'
import { I18n } from '@payloadcms/translations'
import { useTranslation } from '@payloadcms/ui'
import { CustomTranslations, CustomTranslationsKeys } from '../../../lib/i18n/i18n_configs'
const DescriptionStudents = (/* { i18n, payload }: { i18n: I18n; payload: Payload } */) => {
  const { t } = useTranslation<CustomTranslations, CustomTranslationsKeys>()
  return (
    <div className={styles.container}>
      <button
        className={`btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup ${styles.button}`}
        onClick={() => {
          console.log('clicked')
        }}
      >
        {t('Import')}
        {/* {i18n.t('エクセル')} */}
      </button>
    </div>
  )
}

export default DescriptionStudents
