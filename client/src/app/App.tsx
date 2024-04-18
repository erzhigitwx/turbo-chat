import { Layout } from '@/app/config/routes/layout'
import { Header } from '@/widgets/header'
import cl from './styles/app.module.scss'
import { useTheme } from '@/shared/hooks/useTheme'
import { initializeApp } from 'firebase/app'
import { useContext, useEffect } from 'react'
import { getCookie } from '@/shared/utils'
import { SocketContext } from '@/app/providers/socket-provider'
import { fetchUserFx } from '@/app/model'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}
initializeApp(firebaseConfig)

function App() {
  const { theme } = useTheme()
  const socket = useContext(SocketContext)
  const token = getCookie('token')

  useEffect(() => {
    if (token) {
      socket?.emit('user-connect', { token })
    }

    function unloadFunction() {
      socket?.emit('user-disconnect', { token })
    }

    ;(async function getUser() {
      await fetchUserFx()
    })()

    window.addEventListener('beforeunload', unloadFunction)
    return () => {
      if (token) {
        socket?.emit('user-disconnect', { token })
      }
      window.removeEventListener('beforeunload', unloadFunction)
    }
  }, [])

  return (
    <div className={cl.app} data-theme={theme}>
      <Header />
      <section>
        <Layout />
      </section>
    </div>
  )
}

export { App }
