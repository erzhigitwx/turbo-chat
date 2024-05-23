import { Dispatch, SetStateAction } from 'react'
import clsx from 'clsx'
import cl from './chat-sidebar.module.scss'
import { useUnit } from 'effector-react'
import { $chats } from '@/widgets/chat/model/chat'
import ArrowLeft from '@/assets/icons/arrow-left.svg?react'
import { Button } from '@/shared/UI'
import { ChatSidebarItem } from '@/widgets/chat/UI/chat-sidebar/chat-sidebar-item/chat-sidebar-item'

const ChatSidebar = ({
  onlineUsers,
  isChatList,
  setIsChatList,
}: {
  onlineUsers: string[]
  isChatList: boolean
  setIsChatList: Dispatch<SetStateAction<boolean>>
}) => {
  const chats = useUnit($chats)

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
            <ChatSidebarItem
              chat={chat}
              key={chat.id}
              onlineUsers={onlineUsers}
              setIsChatList={setIsChatList}
            />
          ))}
      </div>
    </aside>
  )
}

export { ChatSidebar }
