import React from 'react'
import { ServerPropsWithI18n } from '../../types/serverProps'
import { PlatformInitialization } from './checkPlatformInitialization'
import styles from './PleaseSetup.module.css'
import { Button } from '@payloadcms/ui'
import { TotalClassroom } from './TotalClassroom'
import { SeedButton } from './SeedButton'
import CallToActionWithIcon from '../callToActions/CallToActionWithIcon'

export const PleaseSetup = (
  props: ServerPropsWithI18n & { platformInitializationStatus: PlatformInitialization },
) => {
  return (
    <>
      <SeedButton />

      <div className={`${styles.section} card`}>
        <h2 className={styles.title}>{props.i18n.t('dashboard:please_initialize')}</h2>
        <div className={`divider ${styles.fullWidth}`}></div>
        <div>
          <h4>{props.i18n.t('dashboard:initialize_basic_data')}</h4>
          <Button className={styles.button}>{props.i18n.t('dashboard:import_basic_data')}</Button>
        </div>
        <div>
          <h4>{props.i18n.t('dashboard:initialize_basic_data')}</h4>
          <Button className={styles.button}>{props.i18n.t('dashboard:import_basic_data')}</Button>
        </div>

        <CallToActionWithIcon />
      </div>
    </>
  )
}
