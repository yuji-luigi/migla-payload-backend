import { Button, usePayloadAPI } from '@payloadcms/ui'
import { LoaderPayload } from '../../../Loader/LoaderPayload'
import { RHFDropzone } from '../../../ui/rhf_dropzone'
import styles from './ListItemInitializeModal.module.css'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import { useFormContext } from 'react-hook-form'
import { FilePreview } from '../../../ui/file_preview/FilePreview'
import { CollectionSlug } from 'payload'
import { http } from '../../../../lib/fetch/http'
import { useState } from 'react'
import { LoadingButton } from '../../../Button/LoadingButton'

const ListItemInitializeModal = ({
  enabled = false,
  payloadResult,
  dropzoneText,
  dropzoneButtonText = 'Import',
  dropzoneName,
  title,
  exampleLink,
  uploadEndpoint,
}: {
  title?: string
  enabled: boolean
  dropzoneText?: string
  dropzoneButtonText?: string
  dropzoneName: string
  exampleLink?: string
  payloadResult?: ReturnType<typeof usePayloadAPI>[0]
  uploadEndpoint: `/api/${CollectionSlug}/${'import'}`
}) => {
  const { t } = useCustomTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const { watch, getValues, setValue } = useFormContext()
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
    <li className={styles.li} data-enabled={enabled} data-loading={isLoading}>
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
            <Button
              onClick={() => setValue(dropzoneName, undefined)}
              size="medium"
              className="btn--style-pill"
            >
              {t('button:Change')}
            </Button>
            <LoadingButton
              isLoading={isLoading}
              size="medium"
              type="button"
              className="bg-primary color-primary"
              onClick={async () => {
                try {
                  setIsLoading(true)
                  const formData = new FormData()
                  formData.append('file', getValues(dropzoneName))
                  const response = await http.post(uploadEndpoint, {
                    body: formData,
                  })
                  console.log(response)
                } catch (error) {
                } finally {
                  setIsLoading(false)
                }
              }}
            >
              {t('button:Submit')}
            </LoadingButton>
          </div>
        </div>
      ) : (
        <RHFDropzone
          className={!enabled ? styles.dropzoneDisabled : undefined}
          dropzoneText={dropzoneText ?? t('dropzone:description')}
          dropzoneButtonText={dropzoneButtonText}
          name={dropzoneName}
          enabled={enabled}
        />
      )}
    </li>
  )
}

export default ListItemInitializeModal
