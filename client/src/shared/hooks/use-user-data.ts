import { useContext } from 'react'
import { UserContext } from '@/app/providers/user-provider'

export const useUserData = () => {
  const context = useContext(UserContext)
  if (context === null) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context
}
