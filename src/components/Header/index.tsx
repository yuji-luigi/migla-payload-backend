import { I18n } from '@payloadcms/translations'
import { Payload } from 'payload'

const AfterNavLinks = async ({
  payload,
  searchParams,
  i18n,
  ...rest
}: {
  payload: Payload
  searchParams: Record<string, string>
  i18n: I18n
}) => {
  return <>HEADER</>
}

export default AfterNavLinks
