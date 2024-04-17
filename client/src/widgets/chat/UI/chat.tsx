import cl from './chat.module.scss'
import { ChatList } from './chat-list/chat-list'
import { ChatFrame } from './chat-frame/chat-frame'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { selectedChatChanged } from '@/widgets/chat/model/chat-frame'

const Chat = () => {
  const [searchParams] = useSearchParams()
  const chatId = searchParams.get('chat')

  useEffect(() => {
    if (chatId) {
      selectedChatChanged(chatId)
    }
  }, [chatId])

  return (
    <div className={cl.chat}>
      <ChatList />
      <ChatFrame />
    </div>
  )
}

export { Chat }
