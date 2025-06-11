import { ServerProps } from 'payload'
import { I18nTFunc } from './my_types/i18n_types'
import { Server } from 'http'

export type ServerPropsWithI18n = ServerProps & {
  i18n: ServerProps['i18n'] & {
    t: I18nTFunc
  }
}
