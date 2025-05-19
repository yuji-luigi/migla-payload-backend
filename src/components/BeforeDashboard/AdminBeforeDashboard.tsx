import { Payload } from 'payload'
import React from 'react'
import { User } from '../../payload-types'
import { Button } from '@payloadcms/ui'
import { I18n } from '@payloadcms/translations'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { RootPage } from '@payloadcms/next/views'

export const AdminBeforeDashboard = async (props: { payload: Payload; user: User }) => {
  console.log(props)
  return (
    <DefaultTemplate {...props}>
      <div>
        <button className="btn btn--icon-style-without-border btn--size-large btn--withoutPopup btn--style-pill btn--withoutPopup text-5xl ">
          Import
        </button>
      </div>
    </DefaultTemplate>
  )
}
export default AdminBeforeDashboard
