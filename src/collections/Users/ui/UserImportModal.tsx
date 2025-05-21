'use client'
import React, { useRef, useState } from 'react'
import ModalCustom from '@/components/Modal/ModalCustom'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { Button, Dropzone, useModal } from '@payloadcms/ui'
import { http } from '../../../lib/fetch/http'
import ImportModal from '../../../components/Modal/form_modal/RHFFormModal'

export const UserImportModal = ({ slug }: { slug: string }) => {
  const { t } = useCustomTranslations()
  const [file, setFile] = useState<File | null>(null)
  const { closeModal } = useModal()
  const inputRef = useRef<HTMLInputElement>(null)
  console.log(inputRef.current?.value)

  async function handleChange(files: FileList | null) {
    try {
      console.log(files)
      if (files) {
        const file = files?.[0]
        if (!file) return
        setFile(file)
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
  return <ImportModal slug={slug} />
}

export default UserImportModal
