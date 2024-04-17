import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { SocketProvider } from '@/app/providers/socket-provider'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <SocketProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SocketProvider>
    </BrowserRouter>
  )
}

export { Providers }
