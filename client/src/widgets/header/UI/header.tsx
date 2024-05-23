import cl from './header.module.scss'
import { Link } from 'react-router-dom'
import { useTheme } from '@/shared/hooks/useTheme'
import { useAuth } from '@/shared/hooks/useAuth'
import { Avatar, Toggler } from '@/shared/UI'
import LogoImg from '@/assets/logo.svg?react'
import { setCookie } from '@/shared/utils'
import { ChatCount } from '@/entities/chat-count/chat-count'
import { useUnit } from 'effector-react'
import { $user } from '@/app/model'

const Header = () => {
  const isAuth = useAuth()
  const { theme, setTheme } = useTheme()
  const user = useUnit($user)

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      setCookie('theme', theme === 'dark' ? 'light' : 'dark')
    }
  }

  return (
    <header className={cl.header}>
      <Link to={'/'}>
        <LogoImg />
      </Link>
      <div className={cl.headerLinks}>
        <Link to={'/'}>
          <ChatCount />
        </Link>
        <Toggler value={theme === 'dark'} setter={toggleTheme} size={[48, 34]} isThemeToggler />
        {isAuth && (
          <Link to={'/profile'}>
            <Avatar isActive src={user?.avatar} />
          </Link>
        )}
      </div>
    </header>
  )
}

export { Header }
