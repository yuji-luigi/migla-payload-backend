'use client'
import React, { useRef, useState } from 'react'
import ModalCustom from '../ModalCustom'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { Button, Dropzone, useModal } from '@payloadcms/ui'
import { DropzoneHandler } from '../../ui/dropzone'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFDropzone } from '../../ui/rhf_dropzone'

export const ImportModal = ({ slug }: { slug: string }) => {
  const { t } = useCustomTranslations()
  const { closeModal } = useModal()
  const methods = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <ModalCustom slug={slug} className="tailwind-scope">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <h3>{t('students:importModal:title')}</h3>
          <RHFDropzone
            name="excel"
            dropzoneText={t('students:importModal:dropzone')}
            dropzoneButtonText={t('students:importModal:dropzoneButton')}
          />
          {/* <Dropzone onChange={(e) => console.log(e)}>
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
          <div className="confirmation-modal__controls justify-end">
            <Button size="large" onClick={() => closeModal(slug)} className="">
              {t('button:Close')}
            </Button>

            <Button type="submit" size="large" className="color-primary">
              {t('button:Submit')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </ModalCustom>
  )
}

export default ImportModal
