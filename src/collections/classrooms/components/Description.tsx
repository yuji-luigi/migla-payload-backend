'use client'
import { Button, useModal } from '@payloadcms/ui'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { ClassroomImportModal, importClassroomModalSlug } from './ClassroomImportModal'

const Description = () => {
  const { openModal } = useModal()
  const { t } = useCustomTranslations()

  return (
    <>
      <ClassroomImportModal />
      <div className="flex flex-row">
        <Button className="ml-auto" onClick={() => openModal(importClassroomModalSlug)}>
          {t('button:Import')}
        </Button>
      </div>
    </>
  )
}

export default Description
