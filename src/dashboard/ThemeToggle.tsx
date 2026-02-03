// components/ThemeToggle.tsx
import { useTheme } from "../components/ThemeProvider"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "../components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    // Cycle through themes: light → dark → system → light
    switch (theme) {
      case 'light':
        setTheme('dark')
        break
      case 'dark':
        setTheme('system')
        break
      case 'system':
        setTheme('light')
        break
      default:
        setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5 text-amber-500 transition-transform hover:scale-110" />
      case 'dark':
        return <Moon className="h-5 w-5 text-[color:var(--dashboard-text)] transition-transform hover:scale-110" />
      case 'system':
        return <Monitor className="h-5 w-5 text-[color:var(--dashboard-muted)] transition-transform hover:scale-110" />
      default:
        return <Sun className="h-5 w-5 text-amber-500 transition-transform hover:scale-110" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system preference'
      case 'system':
        return 'Switch to light mode'
      default:
        return 'Switch theme'
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-[color:var(--dashboard-border)] transition-all duration-200"
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
    </Button>
  )
}
