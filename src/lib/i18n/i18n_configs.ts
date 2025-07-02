import { Config } from 'payload'
import { jaSupportedLanguage } from './ja/supportedLanguage'
import { jaCustomTranslations } from './ja/jaCustomTranslations'
import { en } from '@payloadcms/translations/languages/en'
import { it } from '@payloadcms/translations/languages/it'
import type { NestedKeysStripped } from '@payloadcms/translations'
import { enCustomTranslations } from './en/enCustomTranslations'
import { itCustomTranslations } from './it/itCustomTranslations'
const supportedLanguages = {
  ja: jaSupportedLanguage,
  en: en,
  it: it,
} as const

export const i18nConfigs: Config['i18n'] = {
  fallbackLanguage: 'ja',
  supportedLanguages,
  translations: {
    ja: jaCustomTranslations,
    en: enCustomTranslations,
    it: itCustomTranslations,
  },
} as const satisfies Config['i18n']

export const availableLocales = Object.keys(supportedLanguages) as Array<
  keyof typeof supportedLanguages
>

export const availableLocalesWithoutJa = availableLocales.filter((locale) => locale !== 'ja')
// 1) Get the compile‐time union of your keys
export type AvailableLocale = keyof typeof supportedLanguages
// → “ja” | “en” | “it”
type JaCustomTranslations = typeof jaCustomTranslations &
  typeof jaSupportedLanguage &
  typeof itCustomTranslations

type EnCustomTranslations = typeof enCustomTranslations & typeof en
type ItCustomTranslations = typeof itCustomTranslations & typeof it

export type CustomTranslations = JaCustomTranslations & EnCustomTranslations & ItCustomTranslations

export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslations>
