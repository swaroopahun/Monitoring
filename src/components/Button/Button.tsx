import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className = '', children, disabled, ...props }, ref) => {
    const buttonClasses = [
      styles.button,
      styles[`button-${variant}`],
      styles[`button-${size}`],
      disabled && styles.disabled,
      isLoading && styles.loading,
      className,
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className={styles.spinner} />}
        <span className={styles.text}>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
