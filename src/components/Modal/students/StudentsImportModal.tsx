'use client'
import React, { useRef } from 'react'
import ModalCustom from '../ModalCustom'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { Button, Dropzone, useModal } from '@payloadcms/ui'

export const StudentsImportModal = ({ slug }: { slug: string }) => {
  const { t } = useCustomTranslations()
  const { closeModal } = useModal()
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <ModalCustom slug={slug} className="tailwind-scope">
      <h3>{t('students:importModal:title')}</h3>
      <Dropzone onChange={(e) => console.log(e)}>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <p>{t('students:importModal:dropzone')}</p>
          <button
            className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            onClick={() => inputRef.current?.click()}
          >
            {t('students:importModal:dropzoneButton')}
          </button>
        </div>
      </Dropzone>

      <input type="file" ref={inputRef} aria-hidden="true" className="display-none" />
      <div className="confirmation-modal__controls">
        <Button size="large" onClick={() => closeModal(slug)} className="ml-auto">
          {t('button:Close')}
        </Button>
      </div>
    </ModalCustom>
  )
}

export default StudentsImportModal
