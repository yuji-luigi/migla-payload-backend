import React from 'react'
import { ServerPropsWithI18n } from '../../types/serverProps'
import { PlatformInitializationStatus } from './checkPlatformInitialization'
import styles from './PleaseSetup.module.css'
import { Button } from '@payloadcms/ui'
import { TotalClassroom } from './TotalClassroom'
import { SeedButton } from './SeedButton'
import CardTransparent from '../Card/card_transparent/CardTransparent'

export const PleaseSetup = (
  props: ServerPropsWithI18n & { platformInitializationStatus: PlatformInitializationStatus },
) => {
  const t = props.i18n.t
  // get theme in serverside component
  return null
}
