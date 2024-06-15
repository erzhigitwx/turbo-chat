import clsx from 'clsx'
import { FrameCount } from '@/shared/UI'
import { useUnit } from 'effector-react'
import { $chats } from '@/widgets/chat/model/chat'
import ChatImg from '@/assets/icons/chat.svg?react'
import { useUserData } from '@/shared/hooks/use-user-data'

const ChatCount = () => {
  const chats = useUnit($chats)
  const user = useUserData()
  const isHomePage = location.pathname === '/'
  const chatArray = Array.isArray(chats) ? chats : []
  const newMessagesAmount = chatArray.reduce((curr, chat) => {
    if (user?.uid !== chat.messages[chat.messages.length - 1]?.senderId && chat.unread) {
      curr += 1
    }
    return curr
  }, 0)

  return (
    <FrameCount count={newMessagesAmount}>
      <ChatImg className={clsx(isHomePage && 'blue-stroke', 'blue-stroke-hover')} />
    </FrameCount>
  )
}

export { ChatCount }
