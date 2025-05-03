import { Config } from 'payload'
import { jaSupportedLanguage } from './ja/supportedLanguage'
import { jaCustomTranslations } from './ja/jaCustomTranslations'
import { en } from '@payloadcms/translations/languages/en'
import type { NestedKeysStripped } from '@payloadcms/translations'
import { enCustomTranslations } from './en/enCustomTranslations'
export const i18nConfigs: Config['i18n'] = {
  fallbackLanguage: 'ja',
  supportedLanguages: {
    ja: jaSupportedLanguage,
    en: en as any,
  },
  translations: {
    ja: jaCustomTranslations,
    en: enCustomTranslations,
  },
} as const

type JaCustomTranslations = typeof jaCustomTranslations & typeof jaSupportedLanguage

type EnCustomTranslations = typeof enCustomTranslations

export type CustomTranslations = JaCustomTranslations & EnCustomTranslations

export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslations>
