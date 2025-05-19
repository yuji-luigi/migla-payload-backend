import { DefaultTemplate } from '@payloadcms/next/templates'
import { AdminViewServerProps } from 'payload'
import React from 'react'

const ImportPage = ({ initPageResult, params, searchParams }: AdminViewServerProps) => {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      ImportPage
    </DefaultTemplate>
  )
}

export default ImportPage
