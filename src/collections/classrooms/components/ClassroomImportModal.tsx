import React from 'react'
import RHFFormModal from '../../../components/Modal/form_modal/RHFFormModal'
import { useForm, UseFormReturn } from 'react-hook-form'
import { RHFDropzone } from '../../../components/ui/rhf_dropzone'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { http } from '../../../lib/fetch/http'
import excelExamples from '../../../external_links/excel_examples/excel_examples'
import { toast, useListQuery, useModal } from '@payloadcms/ui'
import { ResultUser } from '../../Users/types/result-user'
import { ImportResult } from '../../../types/responses/importResponse'

export const importClassroomModalSlug = 'classroom-import'

export const ClassroomImportModal = ({}) => {
  const { t } = useCustomTranslations()
  const { handleWhereChange } = useListQuery()

  const methods = useForm()
  const { closeModal } = useModal()

  async function handleSubmit(data: any) {
    const formData = new FormData()
    formData.append('file', data.file)
    const response = await http.post<ImportResult<any>>(`/api/classrooms/import`, {
      body: formData,
    })
    await handleWhereChange?.({})
    if (!response.errors.length) {
      closeModal(importClassroomModalSlug)
    } else {
      toast.error('Error while operation', {
        description: (
          <>
            <p>Error users({response.errors.length})</p>
          </>
        ),
      })
    }
  }

  return (
    <RHFFormModal
      methods={methods}
      slug={importClassroomModalSlug}
      title={t('classrooms:importModal:title')}
      subtitle={t('classrooms:importModal:subtitle')}
      className="tailwind-scope"
      submitCallback={handleSubmit}
      loadingText={t('classrooms:importModal:loadingText')}
    >
      <a
        href={excelExamples.classrooms.importDefault}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto"
      >
        {t('button:example_excel')}
      </a>
      <RHFDropzone name={'file'} />
    </RHFFormModal>
  )
}
