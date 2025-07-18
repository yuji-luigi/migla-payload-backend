'use client'
import React from 'react'
import { TailWindScope } from '../../../components/tailwind/TailWindScope'
import { Button, useModal } from '@payloadcms/ui'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { useParams, usePathname } from 'next/navigation'
import { teachersImportModalSlug } from '../slug'
const DescriptionUsers = ({ slug }: { slug: string }) => {
  const { openModal } = useModal()
  const pathname = usePathname()
  const params = useParams()
  const isListPage = pathname.split('/').pop()?.startsWith('teachers')
  const { t } = useCustomTranslations()

  return (
    <TailWindScope className="w-full flex justify-end">
      <Button onClick={() => openModal(teachersImportModalSlug)}>{t('button:Import')}</Button>
    </TailWindScope>
  )
  // return <TailWindScope className="w-full flex justify-end">DescriptionUsers</TailWindScope>
}

export default DescriptionUsers
