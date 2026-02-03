// components/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme
    }
    const savedTheme = window.localStorage.getItem(storageKey) as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme
    }
    return defaultTheme
  })

  useEffect(() => {
    const root = document.documentElement
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const activeTheme = theme === 'system' ? systemTheme : theme

    // Update the data-theme attribute
    root.setAttribute('data-theme', activeTheme)
    root.style.colorScheme = activeTheme

    // Update localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, theme)
    }

    // Add/remove dark class for Tailwind CSS ** the main bug fix  for the theme change**
    if (activeTheme === 'dark') {
      root.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [theme, storageKey])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.setAttribute('data-theme', systemTheme)
        if (systemTheme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
