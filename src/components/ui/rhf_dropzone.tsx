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
  accept,
  onChangeCallback,
  className,
  enabled = true,
  ...others
}: {
  dropzoneText: string
  dropzoneButtonText: string
  name: string
  className?: string | null
  isMultiple?: boolean
  accept?: string[]
  enabled?: boolean
  onChangeCallback?: (file: File) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { control, watch } = useFormContext()
  const { t } = useCustomTranslations()
  const file = watch(name)
  async function handleChange(files: FileList | null, onChange: (value: File) => void) {
    try {
      if (files) {
        const file = files?.[0]
        if (!file) return
        onChange(file)
        if (inputRef.current) {
          inputRef.current.value = ''
        }
        onChangeCallback?.(file)
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
          <Dropzone
            className={className || undefined}
            {...others}
            data-enabled="false"
            onChange={(files) => files && handleChange(files, onChange)}
          >
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              {file ? <FilePreview file={file} /> : <p>{dropzoneText}</p>}
              <div className="flex flex-row gap-2">
                <button
                  type="button"
                  disabled={!enabled}
                  className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
                  onClick={() => inputRef.current?.click()}
                >
                  {file ? t('button:Change') : dropzoneButtonText}
                </button>

                {/* {actions && actions} */}
              </div>
            </div>
          </Dropzone>

          <input
            accept={accept?.join(',')}
            type="file"
            // onChange={(e) => {
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
// const DropzoneBase = () => {
//   return (
//     <>
//       <Dropzone onChange={(files) => files && handleChange(files, onChange)}>
//         <div className="flex flex-col items-center justify-center gap-4 w-full">
//           {file ? <FilePreview file={file} /> : <p>{dropzoneText}</p>}
//           <div className="flex flex-row gap-2">
//             <button
//               type="button"
//               className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
//               onClick={() => inputRef.current?.click()}
//             >
//               {file ? t('button:Change') : dropzoneButtonText}
//             </button>

//             {/* {actions && actions} */}
//           </div>
//         </div>
//       </Dropzone>

//       <input
//         accept={accept?.join(',')}
//         type="file"
//         // onChange={(e) => {
//         //   handleChange(e.target.files)
//         // }}
//         onChange={(e) => {
//           handleChange(e.target.files, onChange)
//         }}
//         aria-hidden="true"
//         className="display-none"
//         ref={(el) => {
//           rhfRef(el)
//           inputRef.current = el
//         }}
//         // {...register(name)}
//         // ref={inputRef}
//       />
//     </>
//   )
// }
