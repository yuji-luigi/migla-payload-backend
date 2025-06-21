import React from 'react'
import ListItemInitializeModal from './ListItemInitializeModal'
import { usePayloadAPI } from '@payloadcms/ui'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import styles from './InitializeDataSteps.module.css'
import { useFormContext } from 'react-hook-form'
import excelExamples from '../../../../external_links/excel_examples/excel_examples'

const InitializeDataSteps = () => {
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
        exampleLink={excelExamples.classrooms.importDefault}
      />
      <ListItemInitializeModal
        title={t('dashboard:modal:import_teachers_heading')}
        enabled={classroomsCompleted}
        completedText={t('dashboard:modal:import_teachers_completed')}
        dropzoneButtonText={t('button:Import')}
        collectionSlug="teachers"
        exampleLink={excelExamples.teachers.importDefault}
      />
      <ListItemInitializeModal
        title={t('dashboard:modal:import_parents_students_heading')}
        completedText={t('dashboard:modal:import_parents_students_completed')}
        dropzoneButtonText={t('button:Import')}
        enabled={true}
        collectionSlug="students"
        exampleLink={excelExamples.parents.importWithStudents}
      />
    </ol>
  )
}

export default InitializeDataSteps
