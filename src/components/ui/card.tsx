// ui/card.tsx - Updated for dark mode support
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-[color:var(--dashboard-surface)] text-[color:var(--dashboard-text)] border border-[color:var(--dashboard-border)] rounded-lg shadow-sm ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
