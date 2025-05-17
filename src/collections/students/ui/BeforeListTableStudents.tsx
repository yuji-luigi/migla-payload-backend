import React from 'react'
import styles from './DescriptionStudents.module.css'
import { Payload } from 'payload'
import { I18n } from '@payloadcms/translations'
const DescriptionStudents = ({ i18n, payload }: { i18n: I18n; payload: Payload }) => {
  return (
    <div className={styles.container}>
      <button
        className={`btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup ${styles.button}`}
      >
        {i18n.t('エクセル')}
      </button>
    </div>
  )
}

export default DescriptionStudents
