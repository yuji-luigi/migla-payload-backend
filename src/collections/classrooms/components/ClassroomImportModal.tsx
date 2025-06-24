import React from 'react'
import RHFFormModal from '../../../components/Modal/form_modal/RHFFormModal'
import { useForm, UseFormReturn } from 'react-hook-form'
import { RHFDropzone } from '../../../components/ui/rhf_dropzone'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { http } from '../../../lib/fetch/http'
import excelExamples from '../../../external_links/excel_examples/excel_examples'

export const ClassroomImportModal = ({}) => {
  const { t } = useCustomTranslations()
  const methods = useForm()

  async function handleSubmit(data: any) {
    console.log(data)
    const formData = new FormData()
    formData.append('file', data.file)
    const response = await http.post(`/api/classrooms/import`, {
      body: formData,
    })
    console.log(response)
  }

  return (
    <RHFFormModal
      methods={methods}
      slug={'classrooms'}
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
