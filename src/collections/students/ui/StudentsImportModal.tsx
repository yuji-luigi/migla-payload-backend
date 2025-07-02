'use client'
import React, { ReactNode, useRef, useState } from 'react'
import ModalCustom from '../../../components/Modal/ModalCustom'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { Button, Dropzone, toast, useListQuery, useModal } from '@payloadcms/ui'
import { DropzoneHandler } from '../../../components/ui/dropzone'
import RHFFormModal from '../../../components/Modal/form_modal/RHFFormModal'
import { RHFDropzone } from '../../../components/ui/rhf_dropzone'
import { useForm } from 'react-hook-form'
import excelExamples from '../../../external_links/excel_examples/excel_examples'
import { http } from '../../../lib/fetch/http'
import { ImportResult } from '../../../types/responses/importResponse'

export const studentsImportModalSlug = 'students-import'

export const StudentsImportModal = () => {
  const { t } = useCustomTranslations()
  const { closeModal } = useModal()
  const { handleWhereChange } = useListQuery()
  async function handleSubmit(data: any) {
    const formData = new FormData()
    formData.append('file', data.studentsExcel)
    const response = await http.post<ImportResult<any>>(`/api/students/import`, {
      body: formData,
    })
    await handleWhereChange?.({})
    if (!response.errors.length) {
      closeModal(studentsImportModalSlug)
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
  const methods = useForm()
  return (
    <RHFFormModal
      methods={methods}
      submitCallback={handleSubmit}
      slug={studentsImportModalSlug}
      title={t('students:importModal:title')}
      className="tailwind-scope"
    >
      <a className="ml-auto" href={excelExamples.parents.importWithStudents} target="_blank">
        {t('common:example_excel')}
      </a>
      <RHFDropzone
        name="studentsExcel"
        dropzoneText={t('students:importModal:dropzone')}
        dropzoneButtonText={t('button:dropzoneImport')}
      />
    </RHFFormModal>
  )
}

export default StudentsImportModal
