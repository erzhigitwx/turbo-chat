import { useContext } from 'react'
import { UserContext } from '@/app/providers/user-provider'

export const useUserData = () => {
  const context = useContext(UserContext)

  return context
}
