'use client'
import React, { ReactNode, useRef, useState } from 'react'
import ModalCustom from '../../../components/Modal/ModalCustom'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { Button, Dropzone, useModal } from '@payloadcms/ui'
import { DropzoneHandler } from '../../../components/ui/dropzone'
import RHFFormModal from '../../../components/Modal/form_modal/RHFFormModal'
import { RHFDropzone } from '../../../components/ui/rhf_dropzone'
import { useForm } from 'react-hook-form'

export const StudentsImportModal = ({ slug }: { slug: string }) => {
  const { t } = useCustomTranslations()
  const { closeModal } = useModal()
  function handleSubmit(data: any) {
    console.log({ data })
  }
  const methods = useForm()
  return (
    <RHFFormModal
      methods={methods}
      submitCallback={handleSubmit}
      slug={slug}
      title={t('students:importModal:title')}
      className="tailwind-scope"
    >
      <RHFDropzone
        name="studentsExcel"
        dropzoneText={t('students:importModal:dropzone')}
        dropzoneButtonText={t('button:dropzoneImport')}
      />
      {/* <Dropzone onChange={(e) => console.log(e)}>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <p>{t('students:importModal:dropzone')}</p>
          <button
            className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            onClick={() => inputRef.current?.click()}
          >
            {t('button:dropzoneImport')}
          </button>
        </div>
      </Dropzone>

      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          console.log(e.target.files)
          handleChange(e.target.files)
        }}
        aria-hidden="true"
        className="display-none"
      /> */}
    </RHFFormModal>
  )
}

export default StudentsImportModal
