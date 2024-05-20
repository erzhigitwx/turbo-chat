import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { Theme } from '@/shared/types/theme'
import { getCookie } from '@/shared/utils'

interface ThemeContextProps {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}

export const ThemeContext = createContext<ThemeContextProps | null>(null)

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getCookie('theme') || 'light')

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeProvider }
