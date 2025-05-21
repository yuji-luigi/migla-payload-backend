'use client'
import React, { useRef, useState } from 'react'
import ModalCustom from '@/components/Modal/ModalCustom'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { Button, Dropzone, useModal } from '@payloadcms/ui'
import { http } from '../../../lib/fetch/http'
import ImportModal, { RHFFormModal } from '../../../components/Modal/form_modal/RHFFormModal'
import { RHFDropzone } from '../../../components/ui/rhf_dropzone'

export const UserImportModal = ({ slug }: { slug: string }) => {
  const { t } = useCustomTranslations()
  function handleSubmit(data: any) {
    console.log(data)
  }
  return (
    <RHFFormModal
      slug={slug}
      title={t('users:importModal:title')}
      subtitle={t('users:importModal:subtitle')}
      className="tailwind-scope"
      submitCallback={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <RHFDropzone
          name="teachers"
          dropzoneText={t('users:importModal:importTeachers')}
          dropzoneButtonText={t('button:dropzoneImport')}
        />
        <button className="btn btn--icon-style-without-border btn--size-small  btn--style-pill my-0 w-fit ml-auto">
          {t('users:importModal:importTeachersExampleExcel')}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <RHFDropzone
          name="parents"
          dropzoneText={t('users:importModal:importParents')}
          dropzoneButtonText={t('button:dropzoneImport')}
        />
        <button className="btn btn--icon-style-without-border btn--size-small  btn--style-pill my-0 w-fit ml-auto">
          {t('users:importModal:importParentsExampleExcel')}
        </button>
      </div>
    </RHFFormModal>
  )
}

export default UserImportModal
