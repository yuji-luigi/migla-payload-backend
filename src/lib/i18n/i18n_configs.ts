import { Config } from 'payload'
import { jaSupportedLanguage } from './ja/supportedLanguage'
import { jaCustomTranslations } from './ja/jaCustomTranslations'
import { en } from '@payloadcms/translations/languages/en'
import { it } from '@payloadcms/translations/languages/it'
import type { NestedKeysStripped } from '@payloadcms/translations'
import { enCustomTranslations } from './en/enCustomTranslations'
import { itCustomTranslations } from './it/itCustomTranslations'
export const i18nConfigs: Config['i18n'] = {
  fallbackLanguage: 'ja',
  supportedLanguages: {
    ja: jaSupportedLanguage,
    en: en,
    it: it,
  },
  translations: {
    ja: jaCustomTranslations,
    en: enCustomTranslations,
    it: itCustomTranslations,
  },
} as const

type JaCustomTranslations = typeof jaCustomTranslations &
  typeof jaSupportedLanguage &
  typeof itCustomTranslations

type EnCustomTranslations = typeof enCustomTranslations & typeof en
type ItCustomTranslations = typeof itCustomTranslations & typeof it

export type CustomTranslations = JaCustomTranslations & EnCustomTranslations & ItCustomTranslations

export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslations>
