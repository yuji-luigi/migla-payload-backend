'use client'
import { FullscreenModal, Modal, useModal } from '@payloadcms/ui'
import React from 'react'

const ModalCustom = ({ slug }: { slug: string }) => {
  console.log({ slug })
  const { closeModal } = useModal()
  return (
    <Modal
      slug={slug}
      onClose={() => {
        closeModal(slug)
      }}
    >
      <div style={{ backgroundColor: 'red' }}>Hello</div>
    </Modal>
  )
}

export default ModalCustom
