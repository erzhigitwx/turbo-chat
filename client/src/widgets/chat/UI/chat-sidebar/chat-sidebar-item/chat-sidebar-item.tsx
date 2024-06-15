import clsx from 'clsx'
import cl from '@/widgets/chat/UI/chat-sidebar/chat-sidebar.module.scss'
import { searchValueChanged } from '@/widgets/chat/model/chat-list'
import { Avatar } from '@/shared/UI'
import { Link } from 'react-router-dom'
import { Chat, UserData } from '@/shared/types'
import { getCookie } from '@/shared/utils'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { SocketContext } from '@/app/providers/socket-provider'
import { useUnit } from 'effector-react'
import { $selectedChat } from '@/widgets/chat/model/chat-frame'
import { Fetch } from '@/shared/utils/methods'
import { useUserData } from '@/shared/hooks/use-user-data'

const ChatSidebarItem = ({
  onlineUsers,
  chat,
  setIsChatList,
}: {
  onlineUsers: string[]
  chat: Chat
  setIsChatList: Dispatch<SetStateAction<boolean>>
}) => {
  const user = useUserData()
  const socket = useContext(SocketContext)
  const selectedChat = useUnit($selectedChat)
  const [opponent, setOpponent] = useState<UserData | null>(null)

  const handleSelectChat = (chat: Chat) => {
    socket?.emit('select-chat', {
      token: getCookie('token'),
      chatId: chat.id,
    })
  }

  useEffect(() => {
    const getOpponentData = async () => {
      const { data } = await Fetch(import.meta.env.VITE_API_URL + '/api/users/get-user', {
        method: 'POST',
        body: JSON.stringify({
          id: chat.opponentId === user?.uid ? chat.creatorId : chat.opponentId,
          token: getCookie('token'),
        }),
      })
      setOpponent(data)
    }

    getOpponentData()
  }, [])

  return (
    <Link
      className={clsx(
        cl.chatListItem,
        selectedChat?.id === chat.id && cl.chatListItemActive,
        chat.isPinned && cl.chatListItemPinned,
      )}
      to={`/?chat=${chat.id}`}
      onClick={() => {
        handleSelectChat(chat)
        setIsChatList(false)
        searchValueChanged('')
      }}
      key={chat.id}
    >
      <Avatar
        size={[40, 40]}
        src={opponent?.avatar}
        isActive={onlineUsers.includes(
          chat.creatorId === user?.uid ? chat.opponentId : chat.creatorId,
        )}
      />
    </Link>
  )
}

export { ChatSidebarItem }
