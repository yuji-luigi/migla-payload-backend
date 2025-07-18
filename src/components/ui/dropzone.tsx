import { Dropzone, useModal } from '@payloadcms/ui'
import React, { useEffect, useRef, useState } from 'react'
import { useCustomTranslations } from '../../lib/i18n/useCustomTranslations'
import { FilePreview } from './file_preview/FilePreview'

export const DropzoneHandler = ({
  dropzoneText,
  dropzoneButtonText,
}: {
  dropzoneText: string
  dropzoneButtonText: string
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { t } = useCustomTranslations()

  async function handleChange(files: FileList | null) {
    try {
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

  return (
    <>
      <Dropzone onChange={(e) => {}}>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          {file ? <FilePreview file={file} /> : <p>{dropzoneText}</p>}
          <button
            className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
            onClick={() => inputRef.current?.click()}
          >
            {file ? t('button:Change') : dropzoneButtonText}
          </button>
        </div>
      </Dropzone>

      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          handleChange(e.target.files)
        }}
        aria-hidden="true"
        className="display-none"
      />
    </>
  )
}
