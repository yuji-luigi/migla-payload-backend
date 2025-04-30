'use client'
import { useTranslation } from '@payloadcms/ui'
import { JaCustomTranslations, JaCustomTranslationsKeys } from './ja/jaCustomTranslations'
export const useCustomTranslations = () => {
  return useTranslation<JaCustomTranslations, JaCustomTranslationsKeys>()
}
