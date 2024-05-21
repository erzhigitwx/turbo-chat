import cl from './chat.module.scss'
import { ChatList } from './chat-list/chat-list'
import { ChatFrame } from './chat-frame/chat-frame'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { selectedChatChanged } from '@/widgets/chat/model/chat-frame'
import { SocketContext } from '@/app/providers/socket-provider'
import { chatMessageAdded, fetchChatsFx } from '@/widgets/chat/model/chat'
import { Message } from '@/shared/types'
import { useWindowWidth } from '@/shared/hooks/useWindowWidth'
import { ChatSidebar } from '@/widgets/chat/UI/chat-sidebar/chat-sidebar'
import { useClickAway } from '@/shared/hooks/useClickAway'

const Chat = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const chatId = searchParams.get('chat')
  const socket = useContext(SocketContext)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [isChatList, setIsChatList] = useState(false)
  const chatListRef = useRef(null)
  const width = useWindowWidth()
  const isTablet = width <= 1000 && width > 500
  const isMobile = width <= 500

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
    if (chatId === data.chatId) {
      socket?.emit('select-chat', {
        chatId,
      })
    }
  }

  useEffect(() => {
    socket?.on('incoming-message', incomingMessageListener)

    return () => {
      socket?.off('incoming-message', incomingMessageListener)
    }
  }, [incomingMessageListener])
  // SOCKET LISTENERS

  useClickAway(chatListRef, () => setIsChatList(false))

  return (
    <div className={cl.chat}>
      {/* show sidebar if not computer */}
      {(isTablet || isMobile) && (
        <ChatSidebar
          onlineUsers={onlineUsers}
          setIsChatList={setIsChatList}
          isChatList={isChatList}
        />
      )}
      {isTablet ? (
        // if tablet, show either with chat-list or without it
        (isChatList && (
          <div className={cl.chatGroup}>
            <ChatFrame onlineUsers={onlineUsers} />
            <ChatList onlineUsers={onlineUsers} />
          </div>
        )) || <ChatFrame onlineUsers={onlineUsers} />
      ) : isMobile ? (
        // if mobile, show either chat-list or chat-frame
        (isChatList && <ChatList onlineUsers={onlineUsers} />) || (
          <ChatFrame onlineUsers={onlineUsers} />
        )
      ) : (
        <>
          {/* show just chat-list and chat-frame(default) */}
          <ChatList onlineUsers={onlineUsers} />
          <ChatFrame onlineUsers={onlineUsers} />
        </>
      )}
    </div>
  )
}

export { Chat }
