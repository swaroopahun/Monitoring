import React from 'react'
import styles from './Card.module.css'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'standard' | 'elevated' | 'interactive'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'standard', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[styles.card, styles[`card-${variant}`], className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
export default Card
