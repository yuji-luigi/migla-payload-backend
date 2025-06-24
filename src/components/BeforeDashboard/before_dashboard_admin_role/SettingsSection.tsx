'use client'
import React from 'react'
import { PlatformInitializationStatus } from '../checkPlatformInitialization'
import CardTransparent from '../../Card/card_transparent/CardTransparent'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'
import { useModal } from '@payloadcms/ui'
import { platform } from 'os'
import { svgClassroom, svgTeacher } from '../../../image_paths/iconPaths'

/**
 * @description BeforeDashboardAdminRole section
 */
const SettingsSection = ({
  platformInitializationStatus: status,
}: {
  platformInitializationStatus: PlatformInitializationStatus
}) => {
  const { openModal } = useModal()
  const { t } = useCustomTranslations()
  console.log({ hasTeachers: status.hasTeachers })
  return (
    <>
      {(!status.hasUsers || !status.hasTeachers || !status.hasClassrooms || !status.hasParents) && (
        <CardTransparent
          onClick={() => {
            openModal('initialize-data')
          }}
          title={t('dashboard:initialize_basic_data')}
          subtitle={t('dashboard:import_basic_data')}
          iconPath={svgTeacher}
        />
      )}
      <CardTransparent
        onClick={() => {}}
        title={t(
          status.hasClassrooms ? 'dashboard:classrooms_title' : 'dashboard:no_classrooms_title',
          {
            count: status.classrooms.length,
          },
        )}
        subtitle={t(
          status.hasClassrooms ? 'dashboard:create_classrooms' : 'dashboard:create_classrooms',
        )}
        iconPath={svgClassroom}
      />
    </>
  )
}

export default SettingsSection
