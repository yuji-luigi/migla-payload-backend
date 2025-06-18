import { Button, SuccessIcon, usePayloadAPI } from '@payloadcms/ui'
import { LoaderPayload } from '../../../Loader/LoaderPayload'
import { RHFDropzone } from '../../../ui/rhf_dropzone'
import styles from './ListItemInitializeModal.module.css'
import { useCustomTranslations } from '../../../../lib/i18n/useCustomTranslations'
import { useFormContext } from 'react-hook-form'
import { FilePreview } from '../../../ui/file_preview/FilePreview'
import { CollectionSlug } from 'payload'
import { http } from '../../../../lib/fetch/http'
import { useEffect, useState } from 'react'
import { LoadingButton } from '../../../Button/LoadingButton'
import { CheckCircleIcon } from 'lucide-react'

const ListItemInitializeModal = ({
  enabled = false,
  // payloadResult,
  dropzoneText,
  dropzoneButtonText = 'Import',
  completedText,
  // dropzoneName,
  title,
  exampleLink,
  // uploadEndpoint,
  collectionSlug,
}: {
  collectionSlug: CollectionSlug
  title?: string
  enabled: boolean
  dropzoneText?: string
  dropzoneButtonText?: string
  completedText?: string
  // dropzoneName: string
  exampleLink?: string
  // payloadResult?: ReturnType<typeof usePayloadAPI>[0]
  // uploadEndpoint: `/api/${CollectionSlug}/${'import'}`
}) => {
  const [payloadResult, { setParams }] = usePayloadAPI(`/api/${collectionSlug}`)
  const { t } = useCustomTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const { watch, getValues, setValue } = useFormContext()
  useEffect(() => {
    console.log(payloadResult?.data.totalDocs)
    if (payloadResult?.data.totalDocs > 0) {
      console.log(`completed ${collectionSlug}`)
      setValue(`${collectionSlug}_completed`, true)
    }
  }, [payloadResult])
  if (payloadResult?.isLoading) {
    return (
      <li className={styles.li} data-enabled={enabled} data-loading={isLoading}>
        <LoaderPayload />
      </li>
    )
  }
  if (payloadResult?.data.totalDocs > 0 && enabled) {
    return (
      <li className={styles.li} data-enabled={enabled} data-loading={isLoading}>
        <div className="flex flex-row items-center gap-2">
          <CheckCircleIcon color="hsl(var(--success))" />
          <p className={styles.title}>{completedText}</p>
        </div>
      </li>
    )
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

      {watch(collectionSlug) ? (
        <div className={styles.filePreviewContainer}>
          <p>{t('dashboard:modal:check_file')}</p>
          <FilePreview file={watch(collectionSlug)} />
          <div className={styles.actions}>
            <Button
              onClick={() => setValue(collectionSlug, undefined)}
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
                  formData.append('file', getValues(collectionSlug))
                  const response = await http.post(`/api/${collectionSlug}/import`, {
                    body: formData,
                  })
                  setParams({ meta: new Date().getTime() })
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
          name={collectionSlug}
          enabled={enabled}
        />
      )}
    </li>
  )
}

export default ListItemInitializeModal
