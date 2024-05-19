import cl from './header.module.scss'
import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '@/shared/hooks/useTheme'
import { useAuth } from '@/shared/hooks/useAuth'
import { Avatar, FrameCount, Toggler } from '@/shared/UI'
import LogoImg from '@/assets/logo.svg?react'
import ChatImg from '@/assets/icons/chat.svg?react'
import { useUnit } from 'effector-react'
import { $chats } from '@/widgets/chat/model/chat'
import { $user } from '@/app/model'

const Header = () => {
  const isAuth = useAuth()
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { theme, setTheme } = useTheme()
  const chats = useUnit($chats)
  const user = useUnit($user)
  const chatArray = Array.isArray(chats) ? chats : []
  const newMessagesAmount = chatArray.reduce((curr, chat) => {
    if (user?.uid !== chat.messages[chat.messages.length - 1]?.senderId && chat.unread) {
      curr += 1
    }
    return curr
  }, 0)

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  }

  return (
    <header className={cl.header}>
      <Link to={'/'}>
        <LogoImg />
      </Link>
      <div className={cl.headerLinks}>
        <Link to={'/'}>
          <FrameCount count={newMessagesAmount}>
            <ChatImg className={clsx(isHomePage && 'blue-stroke', 'blue-stroke-hover')} />
          </FrameCount>
        </Link>
        <Toggler value={theme === 'dark'} setter={toggleTheme} size={[48, 34]} isThemeToggler />
        {isAuth && (
          <Link to={'/profile'}>
            <Avatar isActive />
          </Link>
        )}
      </div>
    </header>
  )
}

export { Header }
