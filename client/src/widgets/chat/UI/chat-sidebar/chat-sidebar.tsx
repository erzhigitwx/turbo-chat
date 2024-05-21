import { Dispatch, SetStateAction, useContext } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import cl from './chat-sidebar.module.scss'
import { useUnit } from 'effector-react'
import { $chats } from '@/widgets/chat/model/chat'
import { $selectedChat } from '@/widgets/chat/model/chat-frame'
import { searchValueChanged } from '@/widgets/chat/model/chat-list'
import { SocketContext } from '@/app/providers/socket-provider'
import ArrowLeft from '@/assets/icons/arrow-left.svg?react'
import { $user } from '@/app/model'
import { getCookie } from '@/shared/utils'
import { Avatar, Button } from '@/shared/UI'
import { Chat } from '@/shared/types'

const ChatSidebar = ({
  onlineUsers,
  isChatList,
  setIsChatList,
}: {
  onlineUsers: string[]
  isChatList: boolean
  setIsChatList: Dispatch<SetStateAction<boolean>>
}) => {
  const user = useUnit($user)
  const chats = useUnit($chats)
  const socket = useContext(SocketContext)
  const selectedChat = useUnit($selectedChat)

  const handleSelectChat = (chat: Chat) => {
    socket?.emit('select-chat', {
      token: getCookie('token'),
      chatId: chat.id,
    })
  }

  return (
    <aside className={cl.chatSidebar}>
      <Button
        className={clsx(cl.chatSidebarSwitch, isChatList && cl.chatSidebarSwitchActive)}
        onClick={() => setIsChatList((prev) => !prev)}
      >
        <ArrowLeft className={'blue-stroke-hover'} />
      </Button>
      <span />
      <div className={cl.chatSidebarContent}>
        {chats
          .sort((a, b) => {
            if (a.isPinned && !b.isPinned) {
              return -1
            }
            if (!a.isPinned && b.isPinned) {
              return 1
            }
            return 0
          })
          .map((chat) => (
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
                isActive={onlineUsers.includes(
                  chat.creatorId === user?.uid ? chat.opponentId : chat.creatorId,
                )}
              />
            </Link>
          ))}
      </div>
    </aside>
  )
}

export { ChatSidebar }
