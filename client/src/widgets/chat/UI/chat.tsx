import cl from './chat.module.scss'
import { ChatList } from './chat-list/chat-list'
import { ChatFrame } from './chat-frame/chat-frame'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { selectedChatChanged } from '@/widgets/chat/model'

const Chat = () => {
  const [searchParams] = useSearchParams()
  const opponentId = searchParams.get('opponent-id')

  useEffect(() => {
    if (opponentId) selectedChatChanged(opponentId)
  }, [opponentId])

  return (
    <div className={cl.chat}>
      <ChatList />
      <ChatFrame />
    </div>
  )
}

export { Chat }
