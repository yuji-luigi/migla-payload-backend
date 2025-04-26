import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export const InputError = () => {
  const {
    formState: { errors },
  } = useFormContext()
  return <div className="mt-2 text-red-500 text-sm"></div>
}
