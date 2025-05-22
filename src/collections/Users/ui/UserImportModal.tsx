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
    // console.log(data)
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
        <button className="btn btn--icon-style-without-border btn--size-small  btn--style-pill my-0 w-fit mr-auto">
          {t('users:importModal:importExampleExcel')}
        </button>
        <RHFDropzone
          name="users"
          dropzoneText={t('users:importModal:importUsers')}
          dropzoneButtonText={t('button:dropzoneImport')}
        />
      </div>
    </RHFFormModal>
  )
}

export default UserImportModal
