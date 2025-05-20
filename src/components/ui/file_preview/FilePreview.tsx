import React from 'react'

export const FilePreview = ({ file }: { file: File }) => {
  console.log(file)
  const fileType = file.type.split('/')[0]
  const isImage = fileType === 'image'
  const isVideo = fileType === 'video'
  const isExcel = fileType === 'application'
  if (isImage) {
    return <img src={URL.createObjectURL(file)} alt={file.name} />
  }
  if (isExcel) {
    return <img src={'/icons/excel_color.svg'} alt={file.name} />
  }
  return (
    <div className="flex items-center gap-2">
      <img
        style={{ background: 'white', objectFit: 'cover' }}
        height={40}
        width={40}
        src={'/icons/mov_light.svg'}
        alt={file.name}
      />
      <img
        style={{ background: 'white' }}
        height={40}
        width={40}
        src={'/icons/mov_dark.svg'}
        alt={file.name}
      />
      <img
        // style={{ background: 'white' }}
        height={40}
        width={40}
        src={'/icons/excel_color.svg'}
        alt={file.name}
      />

      <div>
        <p>{file.name}</p>
        <p>{file.type}</p>
      </div>
    </div>
  )
}
