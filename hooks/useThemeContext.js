import React from 'react'
import { ThemeContext } from '../context/themeProvider'

export default function useThemeContext() {
  const themeContext = React.useContext(ThemeContext)

  const { theme, setTheme } = themeContext

  return {
    theme,
    setTheme,
  }
}
