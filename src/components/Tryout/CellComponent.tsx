import { ClientFieldProps, DefaultCellComponentProps, UIFieldServerProps } from 'payload'
import React from 'react'

// DEMO for user collection fullname cell
export default function UserFullnameCell(props: DefaultCellComponentProps) {
  return (
    <div>
      {props.rowData.name} {props.rowData.surname}{' '}
    </div>
  )
}
