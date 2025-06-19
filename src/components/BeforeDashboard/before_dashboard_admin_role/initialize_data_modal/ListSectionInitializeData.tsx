import React from 'react'
import ListItemInitializeModal from './ListItemInitializeModal'
import { usePayloadAPI } from '@payloadcms/ui'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import styles from './ListSectionInitializeData.module.css'
import { useFormContext } from 'react-hook-form'

const ListSectionInitializeData = () => {
  const { t } = useCustomTranslations()
  const { watch } = useFormContext()
  const classroomsCompleted = watch('classrooms_completed')
  const teachersCompleted = watch('teachers_completed')
  const usersCompleted = watch('users_completed')
  return (
    <ol className={styles.ol}>
      <ListItemInitializeModal
        enabled
        collectionSlug="classrooms"
        completedText={t('dashboard:modal:import_classroom_completed')}
        title={t('dashboard:modal:import_classroom_heading')}
        dropzoneButtonText={t('button:Import')}
        exampleLink="https://docs.google.com/spreadsheets/d/16_AFyrEyBQkeTV1fXVOSGqUaYX9OD1ear90OADCE5G4/edit?usp=sharing"
      />
      <ListItemInitializeModal
        title={t('dashboard:modal:import_teachers_heading')}
        enabled={classroomsCompleted}
        completedText={t('dashboard:modal:import_teachers_completed')}
        dropzoneButtonText={t('button:Import')}
        collectionSlug="teachers"
        exampleLink="https://docs.google.com/spreadsheets/d/1zKXid-7b4e2lyxg05glPbgb_dnrdUFnnrMTMh4XVNT0/edit?usp=sharing"
      />
      <ListItemInitializeModal
        title={t('dashboard:modal:import_users_heading')}
        completedText={t('dashboard:modal:import_users_completed')}
        dropzoneButtonText={t('button:Import')}
        enabled={classroomsCompleted && teachersCompleted}
        collectionSlug="users"
      />
    </ol>
  )
}

export default ListSectionInitializeData
