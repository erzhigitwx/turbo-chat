import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { SocketProvider } from '@/app/providers/socket-provider'
import { ErrorBoundary } from '@/app/providers/error-boundary'
import { UserProvider } from '@/app/providers/user-provider'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<div>unhandled error</div>}>
        <UserProvider>
          <SocketProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </SocketProvider>
        </UserProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export { Providers }
