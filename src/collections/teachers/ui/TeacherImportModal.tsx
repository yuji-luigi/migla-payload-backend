'use client'
import { toast, useListQuery, useModal } from '@payloadcms/ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertMessage } from '../../../components/error/AlertMessage'
import { RHFFormModal } from '../../../components/Modal/form_modal/RHFFormModal'
import { RHFDropzone } from '../../../components/ui/rhf_dropzone'
import { http } from '../../../lib/fetch/http'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { ImportResult } from '../../../types/responses/importResponse'
import { ResultUser } from '../../Users/types/result-user'
import { teachersImportModalSlug } from '../slug'
import excelExamples from '../../../external_links/excel_examples/excel_examples'

export const TeacherImportModal = () => {
  const { handleWhereChange } = useListQuery()
  const { closeModal } = useModal()
  const { t } = useCustomTranslations()
  const methods = useForm()
  const [successfulErrors, setSuccessfulErrors] = useState<any[] | null>(null)

  async function handleSubmit(data: any) {
    try {
      const formData = new FormData()
      formData.append('file', data.users)
      const response = await http.post<ImportResult<ResultUser>>('/api/teachers/import', {
        body: formData,
      })

      await handleWhereChange?.({})

      if (!response.errors.length) {
        closeModal(teachersImportModalSlug)
      } else {
        toast.error('Error while operation', {
          description: (
            <>
              <p>Error users({response.errors.length})</p>
            </>
          ),
        })
        setSuccessfulErrors(response.errors)
      }
      if (response.created.length || response.updated.length) {
        toast.success('Success', {
          description: (
            <>
              <p>created users({response.created.length})</p>
              <p>updated users({response.updated.length})</p>
            </>
          ),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <RHFFormModal
        methods={methods}
        slug={teachersImportModalSlug}
        title={t('teachers:importModal:title')}
        subtitle={t('teachers:importModal:subtitle')}
        className="tailwind-scope"
        submitCallback={handleSubmit}
        loadingText={t('teachers:importModal:loadingText')}
      >
        <div className="flex flex-col gap-2">
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
          <a target="_blank" className="ml-auto" href={excelExamples.teachers.importDefault}>
            <>{t('users:importModal:importExampleExcel')}</>
          </a>
          <RHFDropzone
            onChangeCallback={(_: File) => setSuccessfulErrors(null)}
            name="users"
            accept={['.xlsx', '.xls']}
            dropzoneText={t('components:dropzone:description')}
            dropzoneButtonText={t('components:dropzone:button')}
          />
        </div>
      </RHFFormModal>
    </>
  )
}

export default TeacherImportModal
