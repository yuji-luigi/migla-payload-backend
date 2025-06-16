'use client'

import React, { useState } from 'react'
import RHFFormModal from '../../../Modal/form_modal/RHFFormModal'
import { useForm } from 'react-hook-form'
import { RHFDropzone } from '../../../ui/rhf_dropzone'
import { AlertMessage } from '../../../error/AlertMessage'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import { Button, useModal, usePayloadAPI } from '@payloadcms/ui'
import { TailWindScope } from '../../../tailwind/TailWindScope'
import ListItemInitializeModal from './ListItemInitializeModal'
import ListSectionInitializeData from './ListSectionInitializeData'

const InitializeDataModal = ({ slug }: { slug: string }) => {
  const { t } = useCustomTranslations()
  const methods = useForm()

  const [successfulErrors, setSuccessfulErrors] = useState<any[] | null>(null)

  return (
    <>
      <RHFFormModal
        methods={methods}
        slug={slug}
        submitCallback={() => {
          console.log('submitted!!')
        }}
      >
        <div className="">
          {successfulErrors && (
            <AlertMessage className="my-4">
              {successfulErrors.map((error) =>
                Object.entries(error).map(([key, value]: [string, unknown]) => (
                  <p key={key}>
                    {key} {value as string}
                  </p>
                )),
              )}
            </AlertMessage>
          )}
          <ListSectionInitializeData />

          {/* <a
            target="_blank"
            className="btn btn--icon-style-without-border btn--size-small  btn--style-pill my-0 w-fit mr-auto"
            href="https://docs.google.com/spreadsheets/d/19aswBJ5tY5oCbU_grmCxe9aRscNzmRxKQY8uWxp1-l8/edit?usp=sharing"
          >
            <>{t('users:importModal:importExampleExcel')}</>
          </a>
          <RHFDropzone
            onChangeCallback={(_: File) => setSuccessfulErrors(null)}
            name="users"
            accept={['.xlsx', '.xls']}
            dropzoneText={t('users:importModal:importUsers')}
            dropzoneButtonText={t('button:dropzoneImport')}
          /> */}
        </div>
      </RHFFormModal>
    </>
  )
}

export default InitializeDataModal
