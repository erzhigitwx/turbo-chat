import cl from './chat-frame.module.scss'
import { useUnit } from 'effector-react'
import { $selectedChat } from '@/widgets/chat/model'
import { Chat } from '@/shared/types'

const ChatFrame = () => {
  const selectedChat: Chat | null = useUnit($selectedChat)
  return <div className={cl.chatFrame}>{selectedChat ? selectedChat?.id : 'Chatframe'}</div>
}

export { ChatFrame }
