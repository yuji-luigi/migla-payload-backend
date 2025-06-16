import { usePayloadAPI } from '@payloadcms/ui'
import { LoaderPayload } from '../../../Loader/LoaderPayload'
import { RHFDropzone } from '../../../ui/rhf_dropzone'
import styles from './ListItemInitializeModal.module.css'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'

const ListItemInitializeModal = ({
  enabled = false,
  payloadResult,
  dropzoneText = '',
  dropzoneButtonText = 'Import',
  dropzoneName,
  title,
}: {
  title?: string
  enabled: boolean
  dropzoneText?: string
  dropzoneButtonText?: string
  dropzoneName: string
  payloadResult?: ReturnType<typeof usePayloadAPI>[0]
}) => {
  const { t } = useCustomTranslations()
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
        <button>{t('button:example_excel')}</button>
      </div>

      <RHFDropzone
        className={!enabled ? styles.dropzoneDisabled : undefined}
        dropzoneText={dropzoneText}
        dropzoneButtonText={dropzoneButtonText}
        name={dropzoneName}
        enabled={enabled}
      />
    </li>
  )
}

export default ListItemInitializeModal
