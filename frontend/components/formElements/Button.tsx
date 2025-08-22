import { Button as NextUiButton } from '@heroui/button'
import { Link } from '@heroui/link'
import React, { forwardRef } from 'react'

interface ButtonProps {
  children: React.ReactNode
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost'
  type?: 'button' | 'submit' | 'reset'
  target?: '_blank' | '_self'
  disabled?: boolean
  isLoading?: boolean
  iconOnly?: boolean
  fullWidth?: boolean
  iconStart?: React.ReactNode
  iconEnd?: React.ReactNode
  className?: string
  to?: string
  onClick?: () => void
}

// با استفاده از forwardRef
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      color = 'primary',
      size,
      variant,
      type = 'button',
      target = '_self',
      disabled,
      isLoading,
      iconOnly,
      fullWidth,
      iconStart,
      iconEnd,
      className,
      to,
      onClick,
    },
    ref
  ) => {
    const isLink = Boolean(to)

    return (
      <NextUiButton
        ref={ref} // اضافه کردن ref به Button
        as={isLink ? Link : 'button'}
        className={`font-semibold ${className}`}
        color={color}
        endContent={iconEnd}
        fullWidth={fullWidth}
        href={isLink ? to : undefined}
        isDisabled={disabled}
        isIconOnly={iconOnly}
        isLoading={isLoading}
        radius="sm"
        size={size}
        startContent={iconStart}
        target={target}
        type={type}
        variant={variant}
        onPress={onClick}
      >
        {children}
      </NextUiButton>
    )
  }
)

Button.displayName = 'Button'

export default Button
