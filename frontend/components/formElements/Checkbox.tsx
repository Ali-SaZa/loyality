import React, { PropsWithChildren } from 'react'
import { Checkbox as NextUiCheckbox } from '@nextui-org/checkbox'
import { cn } from '@nextui-org/theme'

interface CheckboxProps {
  className?: string
  value: any
}

const Checkbox = ({ children, className, value }: PropsWithChildren<CheckboxProps>) => {
  return (
    <NextUiCheckbox
      aria-label={'checkbox'}
      classNames={{
        base: cn(
          'inline-flex w-full max-w-full m-0 bg-background-10',
          'hover:bg-content2 items-center justify-start',
          'cursor-pointer rounded-xl p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary data-[selected=true]:bg-background-70',
          className
        ),
        label: 'w-full',
      }}
      value={value}
    >
      {children}
    </NextUiCheckbox>
  )
}

export default Checkbox
