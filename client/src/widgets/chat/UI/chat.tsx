import cl from './chat.module.scss'
import { ChatList } from './chat-list/chat-list'
import { ChatFrame } from './chat-frame/chat-frame'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { selectedChatChanged } from '@/widgets/chat/model/chat-frame'
import { SocketContext } from '@/app/providers/socket-provider'
import { chatMessageAdded, fetchChatsFx } from '@/widgets/chat/model/chat'
import { Message } from '@/shared/types'

const Chat = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const chatId = searchParams.get('chat')
  const socket = useContext(SocketContext)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  if (chatId) {
    selectedChatChanged(chatId)
    socket?.emit('select-chat', {
      chatId,
    })
  }

  // SOCKET LISTENERS
  async function refetchChats() {
    await fetchChatsFx()
  }

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

  useEffect(() => {
    socket?.on('incoming-message', refetchChats)

    return () => {
      socket?.off('incoming-message', refetchChats)
    }
  }, [])

  useEffect(() => {
    socket?.on('chat-selected', refetchChats)

    return () => {
      socket?.off('chat-selected', refetchChats)
    }
  }, [])

  useEffect(() => {
    socket?.on('chat-cleared', refetchChats)

    return () => {
      socket?.off('chat-cleared', refetchChats)
    }
  }, [])

  useEffect(() => {
    socket?.on('chat-deleted', async () => {
      navigate('/')
      selectedChatChanged(null)
      await refetchChats()
    })

    return () => {
      socket?.on('chat-deleted', async () => {
        navigate('/')
        selectedChatChanged(null)
        await refetchChats()
      })
    }
  }, [])

  const incomingMessageListener = async (data: { message: Message; chatId: string }) => {
    if (!data.message) return
    chatMessageAdded(data)
  }

  useEffect(() => {
    socket?.on('incoming-message', incomingMessageListener)

    return () => {
      socket?.off('incoming-message', incomingMessageListener)
    }
  }, [incomingMessageListener])
  // SOCKET LISTENERS

  return (
    <div className={cl.chat}>
      <ChatList onlineUsers={onlineUsers} />
      <ChatFrame onlineUsers={onlineUsers} />
    </div>
  )
}

export { Chat }
