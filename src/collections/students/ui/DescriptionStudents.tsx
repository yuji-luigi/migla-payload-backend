'use client'

import { LoadingOverlayToggle, useModal, usePayloadAPI } from '@payloadcms/ui'
import React, { useRef } from 'react'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import styles from './DescriptionStudents.module.css'
import { http } from '../../../lib/fetch/http'
const DescriptionStudents = () => {
  const { t } = useCustomTranslations()
  const inputRef = useRef<HTMLInputElement>(null)
  const x = useModal()

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (inputRef.current) {
        const file = e.target.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append('file', file)
        await http.post('/api/students/import', {
          body: formData,
        })
        inputRef.current.value = ''
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <div className={styles.container}>
        <input onChange={handleChange} type="file" className="display-none" ref={inputRef} />
        <button
          className={`btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup ${styles.button}`}
          onClick={() => {
            // x.children = <div>Hello</div>
            x.openModal('students')
            // inputRef.current?.click()
          }}
        >
          {t('button:Import')}
        </button>
      </div>
    </>
  )
}

export default DescriptionStudents
