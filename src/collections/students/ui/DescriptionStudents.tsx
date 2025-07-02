'use client'

import { LoadingOverlayToggle, useModal, usePayloadAPI } from '@payloadcms/ui'
import React, { useRef } from 'react'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import styles from './DescriptionStudents.module.css'
import { http } from '../../../lib/fetch/http'
import StudentsImportModal, { studentsImportModalSlug } from './StudentsImportModal'
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
      <StudentsImportModal />
      <div className={styles.container}>
        <input onChange={handleChange} type="file" className="display-none" ref={inputRef} />
        <button
          className={`ml-auto`}
          onClick={() => {
            x.openModal(studentsImportModalSlug)
          }}
        >
          {t('button:Import')}
        </button>
      </div>
    </>
  )
}

export default DescriptionStudents
