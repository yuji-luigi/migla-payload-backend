import { Button } from '@payloadcms/ui'
import React from 'react'
import { LoaderPayload } from '../Loader/LoaderPayload'
import { Loader, Loader2 } from 'lucide-react'
import { cn } from '../../utilities/ui'

export const LoadingButton = ({
  children,
  isLoading,
  className,
  ...other
}: React.ComponentProps<typeof Button> & { isLoading: boolean; className?: string }) => {
  return (
    <Button
      className={cn('btn', className, isLoading && 'btn-loading')}
      data-loading={isLoading}
      {...other}
    >
      {children} {isLoading && <Loader2 className="spinner" />}
    </Button>
  )
}
