import cl from './chat.module.scss'
import { ChatList } from './chat-list/chat-list'
import { ChatFrame } from './chat-frame/chat-frame'
import { useSearchParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { selectedChatChanged } from '@/widgets/chat/model/chat-frame'
import { SocketContext } from '@/app/providers/socket-provider'

const Chat = () => {
  const [searchParams] = useSearchParams()
  const chatId = searchParams.get('chat')
  const socket = useContext(SocketContext)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    if (chatId) {
      selectedChatChanged(chatId)
    }
  }, [chatId])

  useEffect(() => {
    socket?.on('profile-owner-connect', ({ uid }: { uid: string }) => {
      setOnlineUsers((prev) => [...prev, uid])
    })
    socket?.on('profile-owner-disconnect', ({ uid }: { uid: string }) => {
      setOnlineUsers((prev) => prev.filter((userId) => userId === uid))
    })

    return () => {
      socket?.off('profile-owner-connect')
      socket?.off('profile-owner-disconnect')
    }
  }, [])

  return (
    <div className={cl.chat}>
      <ChatList onlineUsers={onlineUsers} />
      <ChatFrame onlineUsers={onlineUsers} />
    </div>
  )
}

export { Chat }
