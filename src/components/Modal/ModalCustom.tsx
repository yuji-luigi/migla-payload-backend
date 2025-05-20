'use client'
import { MinimalTemplate } from '@payloadcms/next/templates'
import { Button, FullscreenModal, Gutter, Modal, useModal } from '@payloadcms/ui'
import { ServerProps } from 'payload'
import React from 'react'
import { useCustomTranslations } from '../../lib/i18n/useCustomTranslations'
import styles from './ModalCustom.module.css'
const ModalCustom = ({
  slug,
  className,
  children,
}: {
  slug: string
  className?: string
  children: React.ReactNode
}) => {
  const { closeModal } = useModal()
  const { t } = useCustomTranslations()
  return (
    <Modal
      closeOnBlur
      slug={slug}
      className={`confirmation-modal ${className} ${styles.modal}`}
      onClose={() => {
        closeModal(slug)
      }}
    >
      <MinimalTemplate style={{ zIndex: 10 }} className="confirmation-modal__template">
        <div className={`confirmation-modal__wrapper ${styles.modalWrapper}`}>{children}</div>
      </MinimalTemplate>
    </Modal>
  )
}

export default ModalCustom
