import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { SocketProvider } from '@/app/providers/socket-provider'
import { ErrorBoundary } from '@/app/providers/error-boundary'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<div>unhandled error</div>}>
        <SocketProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SocketProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export { Providers }
