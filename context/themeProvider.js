import React from 'react'
import { createContext } from 'react'

export const ThemeContext = createContext()

export function VisualModeProvider({ children }) {
  const [theme, setTheme] = React.useState(false)
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
