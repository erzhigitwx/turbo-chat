import Home from '@/pages/home/home'
import Profile from '@/pages/profile/profile'
import Registration from '@/pages/registration/registration'
import { ReactNode } from 'react'

export const routes: IRoute[] = [
  { path: '/', name: 'Home', element: Home(), credentials: true },
  { path: '/registration', name: 'Registration', element: Registration(), credentials: false },
  { path: '/profile', name: 'Profile', element: Profile(), credentials: true },
]

interface IRoute {
  path: string
  element: ReactNode
  name: string
  credentials: boolean
}
