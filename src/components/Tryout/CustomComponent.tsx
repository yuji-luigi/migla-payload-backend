import { ClientFieldProps, DefaultCellComponentProps, UIFieldServerProps } from 'payload'
import React from 'react'

export default function CustomComponent(props: DefaultCellComponentProps) {
  return (
    <div>
      {props.rowData.name} {props.rowData.surname}{' '}
    </div>
  )
}
