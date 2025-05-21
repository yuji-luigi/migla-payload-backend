import { Dropzone, useModal } from '@payloadcms/ui'
import React, { useEffect, useRef, useState } from 'react'
import { useCustomTranslations } from '../../lib/i18n/useCustomTranslations'
import { FilePreview } from './file_preview/FilePreview'
import { Controller, useFormContext } from 'react-hook-form'

export const RHFDropzone = ({
  dropzoneText,
  dropzoneButtonText,
  name,
  isMultiple = false,
}: {
  dropzoneText: string
  dropzoneButtonText: string
  name: string
  isMultiple?: boolean
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { control, watch } = useFormContext()
  const { t } = useCustomTranslations()
  const file = watch(name)
  async function handleChange(files: FileList | null, onChange: (value: File) => void) {
    try {
      console.log(files)
      if (files) {
        const file = files?.[0]
        if (!file) return
        onChange(file)
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
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref: rhfRef } }) => (
        <>
          <Dropzone onChange={(files) => files && handleChange(files, onChange)}>
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
            // onChange={(e) => {
            //   console.log(e.target.files)
            //   handleChange(e.target.files)
            // }}
            onChange={(e) => {
              handleChange(e.target.files, onChange)
            }}
            aria-hidden="true"
            className="display-none"
            ref={(el) => {
              rhfRef(el)
              inputRef.current = el
            }}
            // {...register(name)}
            // ref={inputRef}
          />
        </>
      )}
    />
  )
  return (
    <>
      <Dropzone onChange={(e) => console.log(e)}>
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
        // onChange={(e) => {
        //   console.log(e.target.files)
        //   handleChange(e.target.files)
        // }}
        aria-hidden="true"
        className="display-none"
        // {...register(name)}
        // ref={inputRef}
      />
    </>
  )
}
