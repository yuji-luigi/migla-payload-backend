import React from 'react'
import { getFileIconPath } from './file_icons/file_icon_map'
import { useConfig, useTheme } from '@payloadcms/ui'

export const FilePreview = ({ file }: { file: File }) => {
  const { theme } = useTheme()
  const fileType = file.type.split('/')[0]
  const isImage = fileType === 'image'
  const isVideo = fileType === 'video'
  const extension = file.name.split('.').pop() || ''
  if (isImage) {
    return <img src={URL.createObjectURL(file)} alt={file.name} />
  }
  if (isVideo) {
    return <img src={'/icons/mov_light.svg'} alt={file.name} />
  }
  const iconPath = getFileIconPath(extension, theme)
  if (!iconPath) {
    return <div>No icon found</div>
  }
  return (
    <div className="flex flex-row items-center gap-16">
      <img style={{ background: 'white' }} height={40} width={40} src={iconPath} alt={file.name} />
      <div>
        <p className="text-lg">{file.name}</p>
      </div>
    </div>
  )
}
