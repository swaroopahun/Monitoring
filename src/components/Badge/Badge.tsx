import React from 'react'
import styles from './Badge.module.css'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray'
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'info', className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[styles.badge, styles[`badge-${variant}`], className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
export default Badge
