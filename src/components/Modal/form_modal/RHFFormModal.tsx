'use client'
import React, { ReactNode } from 'react'
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form'
import ModalCustom from '../ModalCustom'
import { Button, LoadingOverlay, LoadingOverlayToggle, useModal } from '@payloadcms/ui'
import { useCustomTranslations } from '../../../lib/i18n/useCustomTranslations'

export const RHFFormModal = ({
  slug,
  className,
  children,
  title,
  submitCallback,
  subtitle,
  customActions,
  actions,
  loadingText,
  methods,
}: {
  /** used also for form id */
  slug: string
  children: React.ReactNode
  title?: string
  className?: string
  submitCallback: (data: any) => void
  subtitle?: string
  customActions?: ReactNode
  actions?: ReactNode
  loadingText?: string
  methods: UseFormReturn<any>
}) => {
  const { closeModal } = useModal()
  const { t } = useCustomTranslations()
  return (
    <>
      <ModalCustom slug={slug} className={`tailwind-scope ${className}`}>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitCallback)}
            className="flex flex-col gap-4"
            id={slug}
          >
            {title && <h2>{title}</h2>}
            {subtitle && <h3>{subtitle}</h3>}
            {children}

            {!customActions && (
              <div className="confirmation-modal__controls justify-end">
                {actions ? (
                  actions
                ) : (
                  <>
                    <Button
                      size="large"
                      type="button"
                      onClick={() => {
                        closeModal(slug)
                        methods.reset()
                      }}
                      className=""
                    >
                      {t('button:Close')}
                    </Button>

                    <Button size="large" type="submit" className="color-primary">
                      {t('button:Submit')}
                    </Button>
                  </>
                )}
              </div>
            )}
            {customActions}
          </form>
        </FormProvider>
      </ModalCustom>
      <LoadingOverlayToggle
        loadingText={loadingText}
        name="form-modal"
        show={methods.formState.isSubmitting}
      />
    </>
  )
}

export default RHFFormModal
