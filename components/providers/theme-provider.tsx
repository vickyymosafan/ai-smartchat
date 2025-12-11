"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"
type ColorScheme = "default" | "ungu" | "netral"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
  storageKey?: string
  colorSchemeStorageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "default",
  storageKey = "smartchat-theme",
  colorSchemeStorageKey = "smartchat-color-scheme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(defaultColorScheme)

  // Load theme from localStorage
  React.useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [storageKey])

  // Load color scheme from localStorage
  React.useEffect(() => {
    const storedScheme = localStorage.getItem(colorSchemeStorageKey) as ColorScheme | null
    if (storedScheme) {
      setColorScheme(storedScheme)
    }
  }, [colorSchemeStorageKey])

  // Apply theme class (dark/light)
  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Apply color scheme attribute
  React.useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute("data-color-scheme", colorScheme)
  }, [colorScheme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
      },
      colorScheme,
      setColorScheme: (newScheme: ColorScheme) => {
        localStorage.setItem(colorSchemeStorageKey, newScheme)
        setColorScheme(newScheme)
      },
    }),
    [theme, storageKey, colorScheme, colorSchemeStorageKey],
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
