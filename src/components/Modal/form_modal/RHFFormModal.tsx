'use client'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import ModalCustom from '../ModalCustom'

export const RHFFormModal = ({
  slug,
  className,
  children,
  title,
  submitCallback,
  subtitle,
}: {
  /** used also for form id */
  slug: string
  children: React.ReactNode
  title?: string
  className?: string
  submitCallback: (data: any) => void
  subtitle?: string
}) => {
  const methods = useForm()

  return (
    <ModalCustom slug={slug} className={`tailwind-scope ${className}`}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(submitCallback)}
          className="flex flex-col gap-4"
          id={slug}
        >
          {title && <h2>{title}</h2>}
          {subtitle && <h3>{subtitle}</h3>}
          {children}
          {/* <RHFDropzone
            name="excel"
            dropzoneText={t('students:importModal:dropzone')}
            dropzoneButtonText={t('button:dropzoneImport')}
          /> */}
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
        </form>
      </FormProvider>
    </ModalCustom>
  )
}

export default RHFFormModal
