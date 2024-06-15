import { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { UserData } from '@/shared/types'
import { Fetch } from '@/shared/utils/methods'
import { getCookie } from '@/shared/utils'

export const UserContext = createContext<UserData | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userRef = useRef<UserData | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    Fetch(import.meta.env.VITE_API_URL + '/api/users/get-user', {
      method: 'POST',
      body: JSON.stringify({
        token: getCookie('token'),
      }),
    }).then((res) => {
      userRef.current = res.data
      setIsReady(true)
    })
  }, [])

  return <UserContext.Provider value={userRef.current}>{isReady && children}</UserContext.Provider>
}
