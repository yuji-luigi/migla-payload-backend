import { Card } from '@payloadcms/ui'
import React from 'react'
import { ServerPropsWithI18n } from '../../types/serverProps'

const InitialMessage = (props: ServerPropsWithI18n) => {
  return (
    <div className="card">
      <div className="card-body">
        <h2>{props.i18n.t('dashboard:please_initialize')}</h2>
      </div>
    </div>
  )
}

export default InitialMessage
