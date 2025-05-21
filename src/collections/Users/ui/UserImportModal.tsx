'use client'
import React, { useRef, useState } from 'react'
import ModalCustom from '@/components/Modal/ModalCustom'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { Button, Dropzone, useModal } from '@payloadcms/ui'
import { http } from '../../../lib/fetch/http'
import ImportModal from '../../../components/Modal/import_modal/ImportModal'

export const UserImportModal = ({ slug }: { slug: string }) => {
  const { t } = useCustomTranslations()
  const [file, setFile] = useState<File | null>(null)
  const { closeModal } = useModal()
  const inputRef = useRef<HTMLInputElement>(null)
  console.log(inputRef.current?.value)

  async function handleChange(files: FileList | null) {
    try {
      console.log(files)
      if (files) {
        const file = files?.[0]
        if (!file) return
        setFile(file)
        // const formData = new FormData()
        // formData.append('file', file)
        // await http.post('/api/students/import', {
        //   body: formData,
        // })
        // inputRef.current.value = ''
      }
    } catch (error) {
      console.error(error)
    }
  }
  return <ImportModal slug={slug} />
  return (
    <ModalCustom slug={slug} className="tailwind-scope">
      <h3>{t('users:importModal:title')}</h3>
      {/* {file && file.name} */}
      <Dropzone onChange={(e) => handleChange(e)}>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <p>{t('users:importModal:dropzone')}</p>
          <button
            className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            onClick={() => inputRef.current?.click()}
          >
            {t('users:importModal:dropzoneButton')}
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
        // aria-hidden="true"
        // className="display-none"
      />
      <div className="confirmation-modal__controls">
        <Button size="large" onClick={() => closeModal(slug)} className="ml-auto">
          {t('button:Close')}
        </Button>
      </div>
    </ModalCustom>
  )
}

export default UserImportModal
