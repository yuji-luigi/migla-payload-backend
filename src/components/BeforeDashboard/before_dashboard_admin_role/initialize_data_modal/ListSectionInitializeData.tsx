import React from 'react'
import ListItemInitializeModal from './ListItemInitializeModal'
import { usePayloadAPI } from '@payloadcms/ui'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import styles from './ListSectionInitializeData.module.css'

const ListSectionInitializeData = () => {
  const [classroomsResult] = usePayloadAPI(`/api/classrooms`)
  const [teachersResult] = usePayloadAPI(`/api/teachers`)
  const [usersResult] = usePayloadAPI(`/api/users`)
  const { t } = useCustomTranslations()

  return (
    <ol className={styles.ol}>
      <ListItemInitializeModal
        enabled
        title={t('dashboard:modal:import_classroom_heading')}
        dropzoneButtonText={t('button:Import')}
        exampleLink="https://docs.google.com/spreadsheets/d/16_AFyrEyBQkeTV1fXVOSGqUaYX9OD1ear90OADCE5G4/edit?usp=sharing"
        payloadResult={classroomsResult}
        dropzoneName="classrooms"
      />
      <ListItemInitializeModal
        title={t('dashboard:modal:import_teachers_heading')}
        enabled={!!classroomsResult.data.length}
        dropzoneButtonText={t('button:Import')}
        payloadResult={teachersResult}
        dropzoneName="teachers"
      />
      <ListItemInitializeModal
        title={t('dashboard:modal:import_users_heading')}
        dropzoneButtonText={t('button:Import')}
        enabled={!!classroomsResult.data.length && !!teachersResult.data.length}
        payloadResult={usersResult}
        dropzoneName="users"
      />
    </ol>
  )
}

export default ListSectionInitializeData
