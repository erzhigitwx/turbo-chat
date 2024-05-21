import clsx from 'clsx'
import { FrameCount } from '@/shared/UI'
import { useUnit } from 'effector-react'
import { $chats } from '@/widgets/chat/model/chat'
import { $user } from '@/app/model'
import ChatImg from '@/assets/icons/chat.svg?react'

const ChatCount = () => {
  const chats = useUnit($chats)
  const user = useUnit($user)
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
