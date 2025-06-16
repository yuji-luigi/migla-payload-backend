import { usePayloadAPI } from '@payloadcms/ui'
import { LoaderPayload } from '../../../Loader/LoaderPayload'
import { RHFDropzone } from '../../../ui/rhf_dropzone'
import styles from './ListItemInitializeModal.module.css'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import { useFormContext } from 'react-hook-form'
import { FilePreview } from '../../../ui/file_preview/FilePreview'

const ListItemInitializeModal = ({
  enabled = false,
  payloadResult,
  dropzoneText = '',
  dropzoneButtonText = 'Import',
  dropzoneName,
  title,
  exampleLink,
}: {
  title?: string
  enabled: boolean
  dropzoneText?: string
  dropzoneButtonText?: string
  dropzoneName: string
  exampleLink?: string
  payloadResult?: ReturnType<typeof usePayloadAPI>[0]
}) => {
  const { t } = useCustomTranslations()
  const { watch } = useFormContext()
  if (payloadResult?.isLoading) {
    return (
      <li style={{}}>
        <LoaderPayload />
      </li>
    )
  }
  if (payloadResult?.data.length > 0) {
    return <div>you got classrooms</div>
  }

  return (
    <li className={styles.li} data-enabled={enabled}>
      <div className={styles.titleRow}>
        <p className={styles.title}>{title}</p>
        {exampleLink && (
          <a href={exampleLink} target="_blank" rel="noopener noreferrer">
            {t('button:example_excel')}
          </a>
        )}
      </div>

      {watch(dropzoneName) ? (
        <div className={styles.filePreviewContainer}>
          <p>{t('dashboard:modal:check_file')}</p>
          <FilePreview file={watch(dropzoneName)} />
          <div className={styles.actions}>
            <button className="">{t('button:Change')}</button>
            <button>{t('button:Submit')}</button>
          </div>
        </div>
      ) : (
        <RHFDropzone
          className={!enabled ? styles.dropzoneDisabled : undefined}
          dropzoneText={dropzoneText}
          dropzoneButtonText={dropzoneButtonText}
          name={dropzoneName}
          enabled={enabled}
        />
      )}
    </li>
  )
}

export default ListItemInitializeModal
