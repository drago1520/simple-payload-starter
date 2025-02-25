import { HeaderThemeProvider } from '@/components/ThemeProvider/HeaderTheme'
import { ThemeProvider } from '@/components/ThemeProvider/Theme'
import React from 'react'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}
