'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import { AlertMessage } from '../../../error/AlertMessage'
import RHFFormModal from '../../../Modal/form_modal/RHFFormModal'
import InitializeDataSteps from './InitializeDataSteps'
import { usePayloadAPI } from '@payloadcms/ui'

const InitializeDataModal = ({ slug }: { slug: string }) => {
  const { t } = useCustomTranslations()
  const methods = useForm()

  return (
    <>
      <RHFFormModal
        methods={methods}
        slug={slug}
        submitCallback={() => {
          console.log('submitted!!')
        }}
      >
        <InitializeDataSteps />
      </RHFFormModal>
    </>
  )
}

export default InitializeDataModal
