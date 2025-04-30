'use client'
import { useTranslation } from '@payloadcms/ui'
import React from 'react'

export const ErrorT = ({ children }: { children: string }) => {
  const { t } = useTranslation()
  return <>{t(children as string)}</>
}
