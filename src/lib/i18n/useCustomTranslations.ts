'use client'
import { useTranslation } from '@payloadcms/ui'
import { CustomTranslations, CustomTranslationsKeys } from './i18n_configs'

export const useCustomTranslations = () => {
  return useTranslation<CustomTranslations, CustomTranslationsKeys>()
}
