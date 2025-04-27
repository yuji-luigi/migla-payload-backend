import { Config } from 'payload'
import { jaSupportedLanguage } from './ja/supportedLanguage'

export const i18nConfigs: Config['i18n'] = {
  fallbackLanguage: 'ja',
  supportedLanguages: {
    ja: jaSupportedLanguage,
  },
  translations: {
    ja: {
      authentication: {
        ERROR_NO_ROLE: 'このユーザーは権限がありません',
      },
    },
    en: {
      authentication: {
        ERROR_NO_ROLE: 'This user does not have access',
      },
    },
  },
}
