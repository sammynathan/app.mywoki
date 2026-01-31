import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

export function Select({ className = '', children, ...props }: SelectProps) {
  const baseClasses = 'flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <select className={`${baseClasses} ${className}`} {...props}>
      {children}
    </select>
  )
}
