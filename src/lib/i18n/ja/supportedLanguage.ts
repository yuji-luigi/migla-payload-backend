import { Config } from 'payload'
import { ja } from '@payloadcms/translations/languages/ja'
const getType: Config['i18n'] = {
  supportedLanguages: {
    ja,
  },
} as const

export const jaSupportedLanguage = getType?.supportedLanguages?.ja
