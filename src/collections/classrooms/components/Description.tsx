'use client'
import { Button } from '@payloadcms/ui'
import React from 'react'
import { useModal } from '@payloadcms/ui'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import RHFFormModal from '../../../components/Modal/form_modal/RHFFormModal'
import { useForm } from 'react-hook-form'
import { ClassroomImportModal } from './ClassroomImportModal'

const Description = () => {
  const { openModal } = useModal()
  const { t } = useCustomTranslations()

  return (
    <>
      <ClassroomImportModal />
      <div className="flex flex-row">
        <Button className="ml-auto" onClick={() => openModal('classrooms')}>
          {t('button:Import')}
        </Button>
      </div>
    </>
  )
}

export default Description
